'use client'
import { useState } from "react";
import axios from "axios";
import InputLabelEl from "../components/FormInputs/InputLabelEl";
import { PDFFile } from "../../../types/pdf";


export default function Home() {

    const [firstName, setFirstName] = useState<string>('');
    const [pdfFile, setPdfFile] = useState<PDFFile | null>(null);

    async function sendMail() {
        try {
            await axios.post('/api/sendEmail', {
                pdfData: JSON.stringify({ pdfFile }),
                firstName: firstName
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        } catch (error) {
            console.log('errror ', error)
        }
    }


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            throw new Error('add a file')
        }

        const file = event.target.files[0];
        if (!file) {
            return
        }
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // @ts-expect-error: error getting 
                const fileData = event.target.result.split(',')[1];
                setPdfFile({
                    name: file.name,
                    type: file.type,
                    data: fileData,
                });
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <main>
            <div className="h-[100vh] max-w-500px mx-auto">

                {/* <InputLabelEl
                    labelText="Fargo Account Number"

                /> */}
                <label>First Name</label>

                <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e)}
                />
                {/* {pdfFile && <p>Selected File: {pdfFile.name}</p>} */}
                <button onClick={sendMail}>Send</button>
            </div>
        </main>
    );
}
