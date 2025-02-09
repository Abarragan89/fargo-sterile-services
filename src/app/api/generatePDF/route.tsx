import { NextResponse, type NextRequest } from 'next/server';
import { pdf } from '@react-pdf/renderer';
import FinalCompletePDF from '@/app/components/pdfTemplates/FinalCompletePDF'
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import mergePDFs from '../../../../utils/mergePdfs';

export async function POST(request: NextRequest) {
    try {
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

        return NextResponse.json(pdfFile);
    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
}