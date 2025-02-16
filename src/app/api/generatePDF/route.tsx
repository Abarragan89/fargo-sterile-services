import { NextResponse, type NextRequest } from 'next/server';
import { pdf } from '@react-pdf/renderer';
import NASUF from '@/app/components/pdfTemplates/NASUF'
import PaymentContactPDF from '@/app/components/pdfTemplates/PaymentContactPDF'
import { PDFDocument, rgb, PDFTextField } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import mergePDFs from '../../../../utils/mergePdfs';
import fontkit from '@pdf-lib/fontkit'
import { formatDate } from '../../../../utils/formatDate';

export async function POST(request: NextRequest) {
    try {
        const { clientInfo } = await request.json();
        // Generate the first PDF from your React component
        const NASUFblob = await pdf(<NASUF data={clientInfo} />).toBlob();
        const paymentContactsBlob = await pdf(<PaymentContactPDF data={clientInfo} />).toBlob();

        // Convert Blob to ArrayBuffer for Generated PDFs
        const NASUFarrayBuffer = await NASUFblob.arrayBuffer();
        const paymentContactsArrayBuffer = await paymentContactsBlob.arrayBuffer();

        // Load the PDF
        const NASUFpdf = await PDFDocument.load(NASUFarrayBuffer);
        const paymentContactPdf = await PDFDocument.load(paymentContactsArrayBuffer);
        let upLoadedDocuments = []
        const documentFields = ['stateLicense', 'deaLicense', 'letterHead', 'taxExceptionDocs', 'otherDocument']

        // Loop through the clientInfo
        for (const item in clientInfo) {
            if (documentFields.includes(item)) {
                if (clientInfo[item]?.data) {
                    const itemIndex = documentFields.indexOf(item)
                    upLoadedDocuments[itemIndex] = await PDFDocument.load(clientInfo[item].data)
                }
            }
        }

        upLoadedDocuments = [...upLoadedDocuments.filter((item) => item !== undefined)]

        // Read the second PDF from file
        const clinicalDifferencePDF = path.join(process.cwd(), 'public', 'pdfs/statementOfClinicalDifference.pdf');
        const clinicalDifferenceBuffer = await fs.readFile(clinicalDifferencePDF);

        // Load the second PDF into pdf-lib
        const clinicalDifferencePdf = await PDFDocument.load(clinicalDifferenceBuffer);

        // Write signature on the alst page of Statement of clinical difference
        const lastPageIndex = clinicalDifferencePdf.getPageCount() - 1;
        const lastPage = clinicalDifferencePdf.getPage(lastPageIndex);

        const cursiveFontPath = path.join(process.cwd(), 'src', 'fonts/cursiveFont.ttf');
        const cursiveFontBytes = await fs.readFile(cursiveFontPath);

        clinicalDifferencePdf.registerFontkit(fontkit)
        const font = await clinicalDifferencePdf.embedFont(cursiveFontBytes, { subset: true });

        //  Draw on clinical statement for user information
        lastPage.drawText(clientInfo.clinicalDifference.signerName, {
            x: 110,
            y: 335,
            size: 18,
            font,
            color: rgb(0, 0, 0),
        });
        lastPage.drawText(clientInfo.clinicalDifference.signerName, {
            x: 90,
            y: 395,
            size: 14,
            color: rgb(0, 0, 0),
        });
        lastPage.drawText(clientInfo.clinicalDifference.facilityName, {
            x: 120,
            y: 422,
            size: 14,
            color: rgb(0, 0, 0),
        });
        lastPage.drawText(clientInfo.clinicalDifference.signerTitle, {
            x: 80,
            y: 365,
            size: 14,
            color: rgb(0, 0, 0),
        });
        lastPage.drawText(formatDate(clientInfo.clinicalDifference.signatureDate), {
            x: 355,
            y: 335,
            size: 14,
            color: rgb(0, 0, 0),
        });
        //  Marking the X
        //  1. Remove the radio boxes
        const form = clinicalDifferencePdf.getForm();
        const radioGroup = form.getRadioGroup('Group5'); // Use the name of the radio button group

        if (radioGroup) {
            // Remove the radio button group field entirely
            form.removeField(radioGroup);
        }
        // Set all text fields to READ ONLY
        const fields = form.getFields();
        fields.forEach(field => {
            const fieldName = field.getName();
            if (field instanceof PDFTextField) {
                try {
                    field.enableReadOnly(); // Set empty value to avoid errors
                } catch (error) {
                    console.error(`Error removing field ${fieldName}:`, error);
                }
            }
        });

        //  2. Mark the X
        lastPage.drawText('X', {
            x: clientInfo.clinicalDifference.facilityAmount === 'one-facility' ? 48 : 49,
            y: clientInfo.clinicalDifference.facilityAmount === 'one-facility' ? 527 : 488,
            size: 17,
            color: rgb(0, 0, 0),
        });

        // Save the updated clinical of difference
        await clinicalDifferencePdf.save();

        //  Merge the two pdfs
        const mergedPDFBase64 = await mergePDFs(NASUFpdf, paymentContactPdf, clinicalDifferencePdf, ...upLoadedDocuments)

        // Convert Base64 to Buffer
        const pdfBuffer = Buffer.from(mergedPDFBase64, 'base64');

        // Return the response as a binary stream
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=GeneratedPDF.pdf',
            },
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes("Payload Too Large")) {
            return new NextResponse(JSON.stringify({ error: "Some uploaded documents are too large to render. Please update your Document Uploads." }), { status: 413 });
        }
        return new NextResponse(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
}