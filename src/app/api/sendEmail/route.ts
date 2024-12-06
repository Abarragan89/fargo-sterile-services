import { NextResponse, type NextRequest } from 'next/server';
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const OAuth2_client = new OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET)
OAuth2_client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export async function POST(request: NextRequest) {
    // Gather data
    const { pdfData } = await request.json();
    const pdfParsed = JSON.parse(pdfData)

    // Transform PDF String back into PDF
    const pdfBufferData = Buffer.from(pdfParsed.pdfFile.data, 'base64')


    const message = {
        from: process.env.GOOGLE_USER,
        to: 'anthony.bar.89@gmail.com',
        subject: 'Math Fact Missions - Activate Account',
        html: `
                <h3>Hello Anthony,</h3>
                <p>-Math Fact Missions</p>
            `,
        attachments: [
            {
                filename: pdfParsed.pdfFile.name, // Name of the pdfFile
                content: pdfBufferData, // Content of the pdfFile (Base64 or Buffer)
                contentType: pdfParsed.pdfFile.type, // MIME type of the pdfFile (e.g., 'application/pdf', 'image/jpeg')
            },
        ]
    }
    // Also send email through nodemailer
    const accessToken = await new Promise((resolve, reject) => {
        // @ts-expect-error: unknown error and toekn
        OAuth2_client.getAccessToken((err, token) => {
            if (err) {
                reject(err);
            }
            resolve(token);
        });
    });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            type: '0Auth2',
            user: process.env.GOOGLE_USER,
            pass: process.env.GOOGLE_PASSWORD,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken
        },
    })

    await new Promise((resolve, reject) => {
        // @ts-expect-error: unknown error and toekn
        transporter.sendMail(message, function (error, info) {
            if (error) {
                console.log('Error')
                reject(error)
            } else {
                console.log('Successfully sent')
                resolve(info)
            }
        })
    })

    return NextResponse.json({ message: 'successs' })
}

