"use client";
import { useEffect, useState } from "react";
import { getFormData } from "../../../utils/indexedDBActions";
import ScrollToTop from "../components/ScrollToTop";
import FormBlockHeading from "@/app/components/Headings/FormBlockHeading"
import SubmitButton from "../components/Buttons/SubmitButton";
import axios from "axios";
import { PDFViewer } from "@react-pdf/renderer";
import FirstPDF from "../components/pdfTemplates/FirstPDF";

export default function ReviewPage() {

    const [clientInfo, setClientInfo] = useState()
    const [showThankYou, setShowThankYou] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [pdfOne, setPdfOne] = useState<string | null>(null)


    useEffect(() => {
        const fetchData = async () => {
            const allClientInfo = await getFormData(); // Fetch saved data from IndexedDB or any source
            console.log('client data ', allClientInfo)
            if (allClientInfo) {
                setClientInfo(allClientInfo);
            }
        };
        fetchData();
    }, [])

    async function sendMail(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true)
        try {
            if (clientInfo)
                await axios.post('/api/sendEmail', {
                    // @ts-expect-error: clienInfo could be undefined
                    pdfData: JSON.stringify({ pdfFile: clientInfo.pdfFile }),
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
            setShowThankYou(true)
        } catch (error) {
            console.log('errror ', error)
        } finally {
            setIsLoading(false)
        }
    }

    const generatePdfForViewers = async () => {
        // e.preventDefault();

        const { data: pdf1 } = await axios.post('/api/generatePDF', {
            clientInfo
        })

        const base64Pdf = pdf1.data;

        // Decode Base64 into a Blob
        const pdfBlob = new Blob([Uint8Array.from(atob(base64Pdf), (char) => char.charCodeAt(0))], {
            type: 'application/pdf',
        });

        // Create an Object URL for the Blob
        const pdfUrl = URL.createObjectURL(pdfBlob);

        setPdfOne(pdfUrl)
        console.log('pdf one ', pdf1)

        // Sending to email logic
        // try {
        //     // Send the structured PDF data to the backend
        //     await axios.post(
        //         '/api/sendEmail',
        //         { pdfData: JSON.stringify({ pdfFile: pdf1 }) }, // Pass the PDF object
        //         { headers: { 'Content-Type': 'application/json' } }
        //     );
        //     console.log('PDF sent successfully!');
        // } catch (error) {
        //     console.error('Error sending PDF:', error);
        // }
    };


    console.log('client info in ', clientInfo)

    useEffect(() => {
        // need to wati to get data from local indexdb
        if (clientInfo) generatePdfForViewers();
    }, [clientInfo])

    return (
        <main className="h-[100vh] max-w-[900px] mx-auto">
            <ScrollToTop />
            <FormBlockHeading headingText="Review Information"/>
            {/* Conditionally render when user pdfs are made */}
            {pdfOne ?
                <div className="w-fit mx-auto">

                    <p>Review your Client Information document and sign below</p>
                    <div style={{ height: '700px', width: '700px' }}>
                        <iframe src={pdfOne as string} width="100%" height="100%" />
                    </div>

                    {/* show submit button or thank you */}
                    {showThankYou ?
                        <div className="h-[70vh] flex justify-center items-center mx-[20px] max-w-[600px] mx-auto">
                            <p className="text-center"> Thank you, your application has been recieved. An email will be sent with a summary of your responses and your sales representative will be in touch.</p>
                        </div>
                        :
                        <>
                            <form onSubmit={sendMail}
                                className="flex justify-center mt-4"
                            >

                                <SubmitButton
                                    isLoading={isLoading}
                                    isSubmittable={true}
                                    color="red"
                                >
                                    Complete
                                </SubmitButton>
                            </form>
                        </>
                    }
                </div>
                :
                <p className="text-center">loading...</p>}
        </main>
    )
}
