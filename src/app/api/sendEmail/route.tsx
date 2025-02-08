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


