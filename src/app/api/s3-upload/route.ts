import { NextResponse, type NextRequest } from 'next/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string
    }
});

async function uploadPdfToS3(file: Buffer, filename: string) {
    const timestampedKey = `${filename}-${Date.now()}`;

    const s3Params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: timestampedKey,
        Body: file,
        ContentType: 'application/pdf',
        ContentDisposition: 'inline'
    };

    const command = new PutObjectCommand(s3Params);
    await s3Client.send(command);
    const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${timestampedKey}`;
    return url;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const pdfFile = formData.get('file');

        if (!pdfFile) {
            return NextResponse.json({ error: 'File is required' }, { status: 400 });
        }

        if (pdfFile instanceof File) {
            if (pdfFile.type !== 'application/pdf') {
                return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
            }

            const buffer = Buffer.from(await pdfFile.arrayBuffer());
            const pdfUrl = await uploadPdfToS3(buffer, pdfFile.name);

            return NextResponse.json({ pdfUrl }, { status: 200 });
        } else {
            throw new Error('Expected file to be a File object');
        }
    } catch (error) {
        console.error('Error uploading PDF:', error);
        return NextResponse.json({ error: 'Failed to upload PDF' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { pdfUrl } = await request.json();
        if (!pdfUrl) {
            return NextResponse.json({ error: 'S3 object key is required' }, { status: 400 });
        }

        const key = pdfUrl.split('.amazonaws.com/')[1];
        const s3Params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key
        };

        const command = new DeleteObjectCommand(s3Params);
        await s3Client.send(command);

        return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting file from S3:', error);
        return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }
}
