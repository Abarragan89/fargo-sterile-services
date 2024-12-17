import { NextResponse, type NextRequest } from 'next/server';
import { pdf } from '@react-pdf/renderer';
import FirstPDF from '@/app/components/pdfTemplates/FirstPDF';
import { Buffer } from 'buffer';

export async function POST(request: NextRequest) {
    const { clientInfo } = await request.json();

    try {
        // Generate the PDF as a Blob
        const pdfBlob = await pdf(<FirstPDF data={clientInfo} />).toBlob();

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

        return NextResponse.json(pdfFile);
    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
}