import { NextResponse, type NextRequest } from 'next/server';
import { pdf } from '@react-pdf/renderer';
import FinalCompletePDF from '@/app/components/pdfTemplates/FinalCompletePDF'
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import mergePDFs from '../../../../utils/mergePdfs';

import sgMail, { MailDataRequired } from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(request: NextRequest) {
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

    const mergedPDFBase64 = await mergePDFs(firstPdf, secondPdf)

    const pdfFile = {
        name: 'GeneratedPDF.pdf',  // File name
        data: mergedPDFBase64,          // Base64-encoded string
        type: 'application/pdf',   // MIME type
    };

    const message: MailDataRequired = {
        from: process.env.GOOGLE_USER as string,
        to: 'anthony.bar.89@gmail.com',
        subject: 'Fargo Sterile Services Confirmation',
        html: `
            <h3>Greeting New Client,</h3>
            <p>Thank you for choosing Fargo Sterile Services!</p>
            <p>Your sales representative will contact you soon.</p>
            <p>Thank you,</p>
            <p>-Fargo Sterile Services</p>
        `,
        attachments: [
            {
                content: pdfFile.data,
                filename: pdfFile.name,
                type: pdfFile.type,
                disposition: 'attachment',
            }
        ],
    };

    try {
        await sgMail.send(message);
    } catch (error) {
        console.error('Failed to send email', error);
    }

    return NextResponse.json({ message: 'successs' })
}


