import { NextResponse, type NextRequest } from 'next/server';
import { salesPersonDirectory } from '../../../../data';
import axios from 'axios';
import { Buffer } from 'buffer';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

// Helper function to convert PDF blob to base64
const blobToBase64 = (blob: Blob) => {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();
        const pdfUrl = form.get('pdfUrl') as string;
        const salesPersonId = form.get('salesPersonId') as keyof typeof salesPersonDirectory;
        const facilityName = form.get('facilityName')

        if (!pdfUrl) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }
        const { name, email } = salesPersonDirectory[salesPersonId];

        // Fetch PDF from URL using axios
        const pdfResponse = await axios.get(pdfUrl, { responseType: 'arraybuffer' });

        // Convert the PDF buffer to base64
        const pdfBase64 = Buffer.from(pdfResponse.data).toString('base64');


        // Email message
        const message: MailDataRequired = {
            from: process.env.GOOGLE_USER as string,
            to: email,
            subject: 'Fagron Sterile Services Confirmation',
            html: `
                <h3>Hi ${name},</h3>
                <p>${facilityName} has just completed their onboarding paperwork!</p>
                <p>Please review the attached pdf and follow up with the client.</p>
                <p>If all information looks complete, you may forward it to the Customer Setup Team.</p>
                <p>Have a great day,</p>
                <p>-Fagron Sterile Services</p>
            `,
            attachments: [
                {
                    content: pdfBase64,
                    filename: 'GeneratedPDF.pdf',
                    type: 'application/pdf',
                    disposition: 'attachment',
                },
            ],
        };

        await sgMail.send(message);

        // Delete the PDF from the bucket: 
        // Call the DELETE route to remove the PDF from S3
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/s3-upload`, {
            data: { pdfUrl }
        });

        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}




