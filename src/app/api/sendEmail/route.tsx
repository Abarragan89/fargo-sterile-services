import { NextResponse, type NextRequest } from 'next/server';
import { salesPersonDirectory } from '../../../../data';
import axios from 'axios';
import { Buffer } from 'buffer';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface FileData {
    documentName: string;
    url: string;
    displayName: string;
    documentType: string;
}
export async function POST(req: NextRequest) {

    const sanitizeFilename = (str: string): string => {
        return str
            .replace(/-/g, '') // Remove hyphens
            .replace(/\s+/g, '') // Remove any remaining spaces
            .trim();
    };

    try {
        const form = await req.formData();
        const pdfUrl = form.get('pdfUrls') as string;
        const pdfUrls = await JSON.parse(pdfUrl) as FileData[] | []
        const salesPersonId = form.get('salesPersonId') as keyof typeof salesPersonDirectory;
        const facilityName = form.get('facilityName') as string


        if (!pdfUrls) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Default to this email, else, send to salesperson
        const { name, email } = salesPersonDirectory[salesPersonId];

        // Fetch all PDFs and create attachments
        const attachments = await Promise.all(
            pdfUrls.map(async (fileData: FileData, index: number) => {
                const file = await axios.get(fileData.url, { responseType: 'arraybuffer' });
                const pdfBase64 = Buffer.from(file.data).toString('base64');
                let extension: string = 'pdf'
                if (fileData.documentType !== 'application/pdf') {
                    extension = 'xlsx'
                }


                return {
                    content: pdfBase64,
                    filename: `${sanitizeFilename(facilityName)}-${fileData.documentName}.${extension}`,
                    type: fileData.documentType,
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

        // Check for tax documents
        let areTaxDocumentsPresent = null;
        // Pull out tax doucments to send to tax department
        for (const attachment of attachments) {
            // Get extension document type after hyphen
            const docType = attachment.filename.split("-")[1]
            if (docType.includes("TAXEXEMPT")) {
                areTaxDocumentsPresent = attachment
                break; // Found one, no need to continue
            }
        }

        // Only send tax email if tax documents are present
        if (areTaxDocumentsPresent) {
            const messageToFagronTax: MailDataRequired = {
                from: process.env.GOOGLE_USER as string,
                to: "fsstax@fagronsterile.com",
                subject: 'Fagron Sterile Services Tax Documents',
                html: `
            <h3>Hi Tax Department,</h3>
            <p>${facilityName} has submitted tax exemption documents as part of their onboarding.</p>
            <p>Please review the attached tax documents.</p>
            <p>Have a great day,</p>
            <p>-Fagron Sterile Services</p>
        `,
                attachments: [areTaxDocumentsPresent],
            };
            await sgMail.send(messageToFagronTax);
        }


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




