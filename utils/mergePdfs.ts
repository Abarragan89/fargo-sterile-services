import { PDFDocument } from 'pdf-lib';

export default async function mergePDFs(...pdfDocs: PDFDocument[]): Promise<PDFDocument> {
    const mergedPdf = await PDFDocument.create();

    for (const pdfDoc of pdfDocs) {
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    return mergedPdf

    // const mergedPdfBytes = await mergedPdf.save();
    // return Buffer.from(mergedPdfBytes).toString('base64');
}
