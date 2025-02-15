import { NextResponse, type NextRequest } from 'next/server';
import { salesPersonDirectory } from '../../../../data';

import sgMail, { MailDataRequired } from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();
        const file = form.get('file') as Blob;
        const salesPersonId = form.get('salesPersonId') as keyof typeof salesPersonDirectory;
        console.log('salesPersonid', salesPersonId)

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const { name, email  } = salesPersonDirectory[salesPersonId];
        console.log('name', name, email);

        // Convert Blob to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const pdfBuffer = Buffer.from(arrayBuffer);

        // Email message
        const message: MailDataRequired = {
            from: process.env.GOOGLE_USER as string,
            to: email,
            subject: 'Fargo Sterile Services Confirmation',
            html: `
                <h3>Hi ${name},</h3>
                <p>A client has just completed their onboarding paperwork!</p>
                <p>Please review the attached pdf and follow up with the client.</p>
                <p>If all information looks complete, you may forward it to the Customer Setup Team.</p>
                <p>Have a great day,</p>
                <p>-Fargo Sterile Services</p>
            `,
            attachments: [
                {
                    content: pdfBuffer.toString('base64'), // Convert to Base64 for email
                    filename: 'GeneratedPDF.pdf',
                    type: 'application/pdf',
                    disposition: 'attachment',
                },
            ],
        };

        await sgMail.send(message);

        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}




