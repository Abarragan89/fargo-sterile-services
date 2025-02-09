"use client";
import { useEffect, useState } from "react";
import { getFormData } from "../../../utils/indexedDBActions";
import ScrollToTop from "../components/ScrollToTop";
import FormBlockHeading from "@/app/components/Headings/FormBlockHeading"
import SubmitButton from "../components/Buttons/SubmitButton";
import axios from "axios";
import { useRouter } from "next/navigation";
import SelectAreaEl from "../components/FormInputs/SelectAreaEl";
import { SelectItem } from "../../../types/formInputs";
import FormProgressBar from "../components/FormProgressBar";
import NineDotsLoader from "../components/LoaderSpinners/NineDotsLoader";

export default function ReviewPage() {

    const selectionArr = [{ id: 'confirmCompletePDF', label: 'By clicking here, you affirm that the information provided above is accurate.' }]

    const router = useRouter();

    const [clientInfo, setClientInfo] = useState();
    const [chosenSelectionArr, setChosenSelectionArr] = useState<SelectItem[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    // pdfOne will be in base64
    const [pdfOne, setPdfOne] = useState<string | null>(null)
    const [completePDFToSend, setCompletePDFToSend] = useState()

    // Get the data from IndexedDB
    useEffect(() => {
        const fetchData = async () => {
            const allClientInfo = await getFormData(); // Fetch saved data from IndexedDB or any source
            if (allClientInfo) {
                setClientInfo(allClientInfo);
            }
        };
        fetchData();
    }, []);

    // Generate the PDF based on IndexedDB
    useEffect(() => {
        // need to wati to get data from local indexdb
        if (clientInfo) generatePdfForViewers();
    }, [clientInfo])

    async function sendMail(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true)
        try {
            if (clientInfo)
                await axios.post('/api/sendEmail', {
                    clientInfo
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
            router.push('/thankyou')
        } catch (error) {
            console.log('errror ', error)
        } finally {
            setIsLoading(false)
        }
    }


    const generatePdfForViewers = async () => {
        const { data: pdf1 } = await axios.post('/api/generatePDF', {
            clientInfo
        })
        setCompletePDFToSend(pdf1)
        const base64Pdf = pdf1.data;
        // Decode Base64 into a Blob
        const pdfBlob = new Blob([Uint8Array.from(atob(base64Pdf), (char) => char.charCodeAt(0))], {
            type: 'application/pdf',
        });
        // Create an Object URL for the Blob
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Coming back as a base64 string
        setPdfOne(pdfUrl)
    };

    return (
        <main className="h-[100vh] max-w-[900px] mx-auto">
            <ScrollToTop />
            <FormProgressBar progress={94} position={6} />
            {/* Conditionally render when user pdfs are made */}
            {pdfOne ?
                <>
                    <FormBlockHeading headingText="Review Information" />
                    <div className="w-full mx-auto pb-[100px]">
                        <p className="text-center font-bold mt-[-5px] mb-3 text-[.95rem]">Confirm the following information is correct and complete.</p>

                        {/* Complete PDF */}
                        <div className="h-[600px] w-full max-w-[700px] mx-auto border-4 border-black">
                            <iframe src={pdfOne as string} width="100%" height="100%" />
                        </div>

                        {/* Submit Button */}
                        <form onSubmit={sendMail}
                            className="flex flex-col justify-center items-center mt-5 w-[700px] mx-auto"
                        >
                            <div>
                                <SelectAreaEl
                                    totalSelectionOptionsArr={selectionArr}
                                    chosenSelectionOptionsArr={chosenSelectionArr}
                                    setChosenSelectionOptionsArr={setChosenSelectionArr}
                                />
                            </div>
                            <SubmitButton
                                isLoading={isLoading}
                                isSubmittable={chosenSelectionArr.length > 0}
                                color="red"
                            >
                                Complete
                            </SubmitButton>
                        </form>
                    </div>
                </>
                :
                <div className="flex flex-col mb-[175px] justify-center items-center">
                    <p className="text-center mb-[20px]">Processing your information...</p>
                    <NineDotsLoader />
                </div>
            }
        </main>
    )
}
