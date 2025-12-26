import { PDFDocument } from "pdf-lib";

export const convertImageToPdf = async (imageFile: File): Promise<Uint8Array> => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
        reader.onload = async () => {
            try {
                const imageBytes = new Uint8Array(reader.result as ArrayBuffer);
                const pdfDoc = await PDFDocument.create();

                // Create page size dynamically based on image size
                const image = imageFile.type === "image/png" ?
                    await pdfDoc.embedPng(imageBytes) :
                    await pdfDoc.embedJpg(imageBytes);

                const { width, height } = image.scale(1); // Scale image to fit

                // Define a page size that fits the image dimensions
                const pageWidth = Math.max(width + 50, 600); // Add margins
                const pageHeight = Math.max(height + 50, 800); // Add margins
                const page = pdfDoc.addPage([pageWidth, pageHeight]);

                page.drawImage(image, {
                    x: 50,
                    y: pageHeight - (height + 20), // Adjust position to fit within page
                    width,
                    height,
                });

                const pdfBytes = await pdfDoc.save();
                resolve(pdfBytes); // Return raw PDF bytes instead of Base64
            } catch (error) {
                reject(new Error(`Error during image to PDF conversion: ${error}`));
            }
        };

        reader.onerror = (error) => reject(new Error(`File reading error: ${error}`));
        reader.readAsArrayBuffer(imageFile);
    });
};

