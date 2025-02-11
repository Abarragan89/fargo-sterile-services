import { NextResponse, type NextRequest } from 'next/server';
import { pdf } from '@react-pdf/renderer';
import FinalCompletePDF from '@/app/components/pdfTemplates/FinalCompletePDF'
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import mergePDFs from '../../../../utils/mergePdfs';
import fontkit from '@pdf-lib/fontkit'

export async function POST(request: NextRequest) {
    try {
        const { clientInfo } = await request.json();
        // Generate the first PDF from your React component
        const pdfBlob = await pdf(<FinalCompletePDF data={clientInfo} />).toBlob();

        // Convert Blob to ArrayBuffer
        const arrayBuffer = await pdfBlob.arrayBuffer();

        // Load the first PDF into pdf-lib
        const firstPdf = await PDFDocument.load(arrayBuffer);

        // Read the second PDF from file
        const clinicalDifferencePDF = path.join(process.cwd(), 'public', 'pdfs/statementOfClinicalDifference.pdf');
        const clinicalDifferenceBuffer = await fs.readFile(clinicalDifferencePDF);

        // Load the second PDF into pdf-lib
        const secondPdf = await PDFDocument.load(clinicalDifferenceBuffer);

        // Write signature on the alst page of Statement of clinical difference
        const lastPageIndex = secondPdf.getPageCount() - 1;
        const lastPage = secondPdf.getPage(lastPageIndex);

        const cursiveFontPath = path.join(process.cwd(), 'src', 'fonts/cursiveFont.ttf');
        const cursiveFontBytes = await fs.readFile(cursiveFontPath);

        secondPdf.registerFontkit(fontkit)
        const font = await secondPdf.embedFont(cursiveFontBytes, { subset: true });

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
        lastPage.drawText(clientInfo.clinicalDifference.signatureDate, {
            x: 355,
            y: 335,
            size: 14,
            color: rgb(0, 0, 0),
        });
        //  Marking the X
        //  1. Remove the radio boxes
        const form = secondPdf.getForm();
        const radioGroup = form.getRadioGroup('Group5'); // Use the name of the radio button group

        if (radioGroup) {
            // Remove the radio button group field entirely
            form.removeField(radioGroup);
        }

        //  2. Mark the X
        lastPage.drawText('X', {
            x: clientInfo.clinicalDifference.facilityAmount === 'one-facility' ?  48 : 49,
            y: clientInfo.clinicalDifference.facilityAmount === 'one-facility' ?  527 : 488,
            size: 17,
            color: rgb(0, 0, 0),
        });

        // Save the updated clinical of difference
        await secondPdf.save();

        //  Merge the two pdfs
        const mergedPDFBase64 = await mergePDFs(firstPdf, secondPdf)

        const pdfFile = {
            name: 'GeneratedPDF.pdf',  // File name
            data: mergedPDFBase64,          // Base64-encoded string
            type: 'application/pdf',   // MIME type
        };

        return NextResponse.json(pdfFile);
    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
}