import { NextResponse, type NextRequest } from 'next/server';
import { pdf } from '@react-pdf/renderer';
import FinalCompletePDF from '@/app/components/pdfTemplates/FinalCompletePDF'
import { Buffer } from 'buffer';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

import sgMail, { MailDataRequired } from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(request: NextRequest) {
    const { clientInfo } = await request.json();
    // const pdfBlob = await pdf(<FinalCompletePDF data={clientInfo} />).toBlob();

    // // Convert Blob to Buffer
    // const arrayBuffer = await pdfBlob.arrayBuffer();

    // const buffer = Buffer.from(arrayBuffer);

    // // Convert Buffer to Base64
    // const base64data = buffer.toString('base64');









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

    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();

    // Copy pages from the first PDF
    const firstPdfPages = await mergedPdf.copyPages(firstPdf, firstPdf.getPageIndices());
    firstPdfPages.forEach(page => mergedPdf.addPage(page));

    // Copy pages from the second PDF
    const secondPdfPages = await mergedPdf.copyPages(secondPdf, secondPdf.getPageIndices());
    secondPdfPages.forEach(page => mergedPdf.addPage(page));

    // Save the merged PDF
    const mergedPdfBytes = await mergedPdf.save();

    // Convert to Buffer or Base64 if needed
    const mergedPdfBuffer = Buffer.from(mergedPdfBytes);
    const mergedPdfBase64 = mergedPdfBuffer.toString('base64');
    const pdfFile = {
        name: 'GeneratedPDF.pdf',  // File name
        data: mergedPdfBase64,          // Base64-encoded string
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


