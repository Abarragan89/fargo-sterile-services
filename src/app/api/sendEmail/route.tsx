import { NextResponse, type NextRequest } from 'next/server';
import { pdf } from '@react-pdf/renderer';
import FinalCompletePDF from '@/app/components/pdfTemplates/FinalCompletePDF'
import { Buffer } from 'buffer';

import sgMail, { MailDataRequired } from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(request: NextRequest) {
    const { clientInfo } = await request.json();
    const pdfBlob = await pdf(<FinalCompletePDF data={clientInfo} />).toBlob();
    // Convert Blob to Buffer
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert Buffer to Base64
    const base64data = buffer.toString('base64');

    const pdfFile = {
        name: 'GeneratedPDF.pdf',  // File name
        data: base64data,          // Base64-encoded string
        type: 'application/pdf',   // MIME type
    };

    // // Gather data
    // const { pdfData } = await request.json();
    // const pdfParsed = JSON.parse(pdfData)

    // // Transform PDF String back into PDF
    // const pdfBufferData = Buffer.from(pdfParsed.pdfFile.data, 'base64')

    const message: MailDataRequired = {
        from: process.env.GOOGLE_USER as string,
        to: 'anthony.bar.89@gmail.com',
        subject: 'Fargo Sterile Services Confirmation',
        html: `
            <h3>Greeting New Client,</h3>
            <p>Thank your for completing our onboarding!</p>
            <p>Your sales representative will contact you soon.</p>
            <p>-Fargo Sterile Services</p>
        `,
        attachments: [
            {
                content: pdfFile.data,
                filename: pdfFile.name,
                type: pdfFile.type,
                disposition: 'attachment',
            },
        ],
        // attachments: [
        //     {
        //         content: pdfBufferData.toString('base64'), // Convert the file content to Base64
        //         filename: pdfParsed.pdfFile.name, // Name of the PDF file
        //         type: pdfParsed.pdfFile.type, // MIME type of the PDF file (e.g., 'application/pdf')
        //         disposition: 'attachment', // Marks it as an attachment
        //     },
        // ],
    };

    try {


        await sgMail.send(message);
    } catch (error) {
        console.error('Failed to send email', error);
    }

    return NextResponse.json({ message: 'successs' })
}


