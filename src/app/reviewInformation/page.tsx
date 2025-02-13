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
    const [PDFBlob, setPDFBlob] = useState<Blob>()

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
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', PDFBlob as Blob, 'GeneratedPDF.pdf'); // Attach the Blob
            formData.append('clientInfo', JSON.stringify(clientInfo)); // Attach clientInfo as a string
    
            await axios.post('/api/sendEmail', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            router.push('/thankyou');
        } catch (error) {
            console.error('Error sending email:', error);
        } finally {
            setIsLoading(false);
        }
    }


    const generatePdfForViewers = async () => {
        try {
            const response = await axios.post('/api/generatePDF', { clientInfo }, { responseType: 'blob' });
    
            // Convert Blob to Object URL
            const pdfUrl = URL.createObjectURL(response.data);
            setPDFBlob(response.data)
            // Set the iframe source
            setPdfOne(pdfUrl);
        } catch (error) {
            console.error("Error fetching PDF:", error);
        }
    };

    return (
        <main className="h-[100vh] max-w-[900px] mx-auto">
            <ScrollToTop />
            <FormProgressBar progress={92} position={6} />
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
                                isSubmittable={chosenSelectionArr?.length > 0}
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
