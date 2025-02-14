import { NextResponse, type NextRequest } from 'next/server';

import sgMail, { MailDataRequired } from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();
        const file = form.get('file') as Blob;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Convert Blob to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const pdfBuffer = Buffer.from(arrayBuffer);

        // Email message
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




