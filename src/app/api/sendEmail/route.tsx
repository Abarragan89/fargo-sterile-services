import { NextResponse, type NextRequest } from 'next/server';
import { salesPersonDirectory } from '../../../../data';
import axios from 'axios';
import { Buffer } from 'buffer';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface PDFdata {
    documentType: string;
    url: string
}
export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();
        const pdfUrl = form.get('pdfUrls') as string;
        const pdfUrls = await JSON.parse(pdfUrl) as PDFdata[] | []
        const salesPersonId = form.get('salesPersonId') as keyof typeof salesPersonDirectory;
        const facilityName = form.get('facilityName') as string

        if (!pdfUrls) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }
        const { name, email } = salesPersonDirectory[salesPersonId];

        // Fetch all PDFs and create attachments
        const attachments = await Promise.all(
            pdfUrls.map(async (pdfData: PDFdata, index: number) => {
                const pdfResponse = await axios.get(pdfData.url, { responseType: 'arraybuffer' });
                const pdfBase64 = Buffer.from(pdfResponse.data).toString('base64');
                return {
                    content: pdfBase64,
                    filename: `${facilityName.replace(/ /g, '')}-${pdfData.documentType}.pdf`,
                    type: 'application/pdf',
                    disposition: 'attachment',
                };
            })
        );


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
            attachments,
        };

        await sgMail.send(message);

        // Delete the PDF from the bucket: 
        for (const pdfUrl of pdfUrls) {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/s3-upload`, {
                data: { pdfUrl: pdfUrl.url }
            });
        }

        return NextResponse.json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}




