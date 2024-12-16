"use client";
import { useEffect, useState, useRef } from "react";
import { getFormData } from "../../../utils/indexedDBActions";
import ScrollToTop from "../components/ScrollToTop";
import FormBlockHeading from "@/app/components/Headings/FormBlockHeading"
import SubmitButton from "../components/Buttons/SubmitButton";
import axios from "axios";
import { pdf } from '@react-pdf/renderer';
import FirstPDF from '@/app/components/pdfTemplates/FirstPDF';

export default function ReviewPage() {

    const [clientInfo, setClientInfo] = useState()
    const [showThankYou, setShowThankYou] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)

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


    const handleGenerateAndSend = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { data: pdf1 } = await axios.post('/api/generatePDF', {
            clientInfo
        })

        console.log('pdf #1 in the front end', pdf1)
        try {
            // Send the structured PDF data to the backend
            await axios.post(
                '/api/sendEmail',
                { pdfData: JSON.stringify({ pdfFile: pdf1 }) }, // Pass the PDF object
                { headers: { 'Content-Type': 'application/json' } }
            );

            console.log('PDF sent successfully!');
        } catch (error) {
            console.error('Error sending PDF:', error);
        }

    };

    return (
        <main className="h-[100vh] max-w-[900px] mx-auto">
            <ScrollToTop />
            {showThankYou ?
                <div className="h-[70vh] flex justify-center items-center mx-[20px] max-w-[600px] mx-auto">
                    <p className="text-center"> Thank you, your application has been recieved. An email will be sent with a summary of your responses and your sales representative will be in touch.</p>
                </div>
                :
                <>
                    {clientInfo &&
                        <section className="text-center">
                            <FormBlockHeading headingText="Review Information" />
                            <p>Review the Information below</p>
                        </section>
                    }
                    <form onSubmit={(e) => handleGenerateAndSend(e)}
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

        </main>
    )
}
