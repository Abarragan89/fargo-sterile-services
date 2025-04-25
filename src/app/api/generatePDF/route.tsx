import { NextResponse, type NextRequest } from 'next/server';
import { pdf } from '@react-pdf/renderer';
import NASUF from '@/app/components/pdfTemplates/NASUF'
import PaymentContactPDF from '@/app/components/pdfTemplates/PaymentContactPDF'
import { PDFDocument, rgb, PDFTextField } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import fontkit from '@pdf-lib/fontkit'
import { formatDate } from '../../../../utils/formatDate';
import mergePDFs from '../../../../utils/mergePdfs';

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


        /////////// was trying to compress before loading to s3 ///////////////
        // Compress generated PDFs
        // const compressedNASUFpdf = await NASUFpdf.save({ useObjectStreams: false });
        // const compressedPaymentContactPdf = await paymentContactPdf.save({ useObjectStreams: false });

        // // Reload compressed PDFs
        // const compressedNASUF = await PDFDocument.load(compressedNASUFpdf);
        // const compressedPaymentContact = await PDFDocument.load(compressedPaymentContactPdf);

        let upLoadedDocuments = []
        const documentFields = [
            'stateLicense',
            'deaLicense',
            'letterHead',
            'taxExceptionDocs',
            'facilityRoster',
            'otherDocument'
        ]

        for (const item in clientInfo) {
            if (documentFields.includes(item)) {
                if (clientInfo[item]?.data) {
                    let documentName = ''
                    let displayName = ''
                    const documentType = clientInfo[item]?.type
                    switch (item) {
                        case 'stateLicense':
                            documentName = 'STATE';
                            displayName = 'State License';
                            break;
                        case 'deaLicense':
                            documentName = 'DEA';
                            displayName = 'DEA License';
                            break;
                        case 'letterHead':
                            documentName = 'LETTERHEAD';
                            displayName = 'Letter Head';
                            break;
                        case 'taxExceptionDocs':
                            documentName = 'TAXEXEMPT';
                            displayName = 'Tax Exemption Documents';
                            break;
                        case 'facilityRoster':
                            documentName = 'facilityRoster';
                            displayName = 'Facility Roster';
                            break;
                        case 'otherDocument':
                            documentName = 'OTHERDOCS';
                            displayName = 'Other Documents';
                            break;
                    }
                    upLoadedDocuments.push({
                        documentName: documentName,
                        displayName: displayName,
                        url: clientInfo[item]?.data,
                        documentType: documentType
                    }
                    )
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
        lastPage.drawText(clientInfo.facilityInformation.facilityName, {
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

        // Write on PDF for other facilities don't need this anymore 
        // if (clientInfo?.otherFacilities?.length > 0) {
        //     let yAxisForOtherFacilities = 250
        //     lastPage.drawText('List of other facilities:', {
        //         x: 30,
        //         y: yAxisForOtherFacilities,
        //         size: 12,
        //         color: rgb(0, 0, 0),
        //     });
        //     const titleWidth = font.widthOfTextAtSize('OList of other facilities', 12);
        //     lastPage.drawLine({
        //         start: { x: 30, y: yAxisForOtherFacilities - 1 },
        //         end: { x: 30 + titleWidth + 10, y: yAxisForOtherFacilities - 1 },
        //         thickness: 1,
        //         color: rgb(0, 0, 0),
        //     });

        //     for (let i = 0; i < clientInfo.otherFacilities.length; i++) {
        //         yAxisForOtherFacilities = yAxisForOtherFacilities - 20
        //         lastPage.drawText(`${i + 1}. ${clientInfo.otherFacilities[i].value}`, {
        //             x: 30,
        //             y: yAxisForOtherFacilities,
        //             size: 12,
        //             color: rgb(0, 0, 0),
        //         });
        //     }
        // }

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

        const combinedNASUFandPayments = await mergePDFs(NASUFpdf, paymentContactPdf)

        const generatedPDFs = [
            {
                documentName: 'SOCD',
                displayName: 'Statement of Clinical Difference',
                data: clinicalDifferencePdf
            },
            {
                documentName: 'NASUF',
                displayName: 'Facility Information / Terms & Conditions / Payment & Contacts',
                data: combinedNASUFandPayments
            },
        ];

        // Array to hold uploaded PDF URLs
        const pdfUrls = [...upLoadedDocuments];

        // Upload each PDF that was generated in the route individually to S3 (some pdfs are already just url strings) 
        for (const pdfDocument of generatedPDFs) {

            // Serialize the PDF document to a Uint8Array
            const pdfBytes = await pdfDocument!.data.save(); // This returns a Uint8Array

            // Convert the Uint8Array to a Blob
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });

            const formData = new FormData();
            formData.append('file', blob);
            formData.append('key', `generated-pdfs/${Date.now()}-GeneratedPDF.pdf`);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/s3-upload`, {
                method: 'POST',
                body: formData,
            });

            const uploadResult = await response.json();

            if (!response.ok) {
                return new NextResponse(JSON.stringify({ error: uploadResult.error }), { status: 500 });
            }
            // Add the uploaded PDF URL to the array
            pdfUrls.unshift({ documentName: pdfDocument?.documentName as string, url: uploadResult.pdfUrl, displayName: pdfDocument.displayName, documentType: 'application/pdf' });
        }

        return NextResponse.json({ urls: pdfUrls }, { status: 200 });

    } catch (error) {
        console.log('error generating pdf', error)
        if (error instanceof Error && error.message.includes("Request Entity Too Large")) {
            return new NextResponse(JSON.stringify({ error: "Some uploaded documents are too large to render. Please update your Document Uploads." }), { status: 413 });
        }
        return new NextResponse(JSON.stringify({ error: (error as Error).message }), { status: 500 });
    }
}