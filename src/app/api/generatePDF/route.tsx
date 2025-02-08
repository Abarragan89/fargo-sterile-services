import { NextResponse, type NextRequest } from 'next/server';
import { pdf } from '@react-pdf/renderer';
import FinalCompletePDF from '@/app/components/pdfTemplates/FinalCompletePDF'
import { Buffer } from 'buffer';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    const { clientInfo } = await request.json();

    try {
        // Generate the PDF as a Blob
        // const pdfBlob = await pdf(<FinalCompletePDF data={clientInfo} />).toBlob();


        // // Convert Blob to Buffer
        // const arrayBuffer = await pdfBlob.arrayBuffer();
        // const buffer = Buffer.from(arrayBuffer);

        // // Convert Buffer to Base64
        // const base64data = buffer.toString('base64');



        // // Getting statement of clinical difference
        // const clinicalDifferencePDF = path.join(process.cwd(), 'public', 'pdfs/statementOfClinicalDifference.pdf'); // First PDF

        // // Read the PDF file as a buffer
        // const clinicalDifferenceBuffer = await fs.readFile(clinicalDifferencePDF);

        // // Convert Buffer to Base64
        // const clinicalDifferenceBase64 = clinicalDifferenceBuffer.toString('base64');

        

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

        return NextResponse.json(pdfFile);
    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
}