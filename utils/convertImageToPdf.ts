import { PDFDocument } from "pdf-lib";


const arrayBufferToBase64 = (buffer: Uint8Array<ArrayBufferLike>): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

export const readFileAsBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // @ts-expect-error: Error ignored
            resolve(reader.result.split(",")[1]); // Extract Base64
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};

export const convertImageToPdf = async (imageFile: File): Promise<string> => {
    const reader = new FileReader();

    console.log('image type ', imageFile.type)
    return new Promise((resolve, reject) => {
        reader.onload = async () => {
            try {
                const imageBytes = new Uint8Array(reader.result as ArrayBuffer);
                const pdfDoc = await PDFDocument.create();
                const page = pdfDoc.addPage([600, 800]); // Standard page size

                let image;
                if (imageFile.type === "image/png") {
                    image = await pdfDoc.embedPng(imageBytes);
                } else if (imageFile.type === "image/jpeg" || imageFile.type === "image/jpg") {
                    image = await pdfDoc.embedJpg(imageBytes);
                } else {
                    return reject(new Error("Unsupported image format"));
                }

                const { width, height } = image.scale(1); // Scale the image
                page.drawImage(image, {
                    x: 50,
                    y:  700 - (height + 20),
                    width,
                    height,
                });

                const pdfBytes = await pdfDoc.save();
                const base64Pdf = arrayBufferToBase64(pdfBytes);
                resolve(base64Pdf);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(imageFile);
    });
};
