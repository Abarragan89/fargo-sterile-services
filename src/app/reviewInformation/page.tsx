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

interface RequestError {
    code: string,
    message: string
}

export default function ReviewPage() {

    const selectionArr = [{ id: 'confirmCompletePDF', label: 'By clicking here, you affirm that the information provided above is accurate.' }]
    const router = useRouter();
    const [clientInfo, setClientInfo] = useState();
    const [chosenSelectionArr, setChosenSelectionArr] = useState<SelectItem[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    // pdfOne will be in base64
    const [pdfOne, setPdfOne] = useState<string | null>(null)
    const [PDFBlob, setPDFBlob] = useState<Blob>()
    const [salesPersonId, setSalesPersonId] = useState('')
    const [errorMessage, setErrorMessage] = useState<RequestError>()

    // Get the data from IndexedDB
    useEffect(() => {
        const fetchData = async () => {
            const allClientInfo = await getFormData(); // Fetch saved data from IndexedDB or any source
            if (allClientInfo) {
                setClientInfo(allClientInfo);
                setSalesPersonId(allClientInfo.salesPersonId)
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
            formData.append('salesPersonId', salesPersonId); // Attach clientInfo as a string

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
            setIsLoading(true)
            const response = await axios.post('/api/generatePDF', { clientInfo }, { responseType: 'blob' });
            // Convert Blob to Object URL
            const pdfUrl = URL.createObjectURL(response.data);
            setPDFBlob(response.data)
            // Set the iframe source
            setPdfOne(pdfUrl);
        } catch (error) {
            let message = error;  // Keep the entire error object

            if (axios.isAxiosError(error)) {
                if (error.response?.data instanceof Blob) {
                    try {
                        const errorText = await error.response?.data?.text();
                        const errorJson = JSON.parse(errorText);
                        message = errorJson.error || error; // Keep error if parsing fails
                    } catch (parseError) {
                        message = error; // Keep the original error if parsing fails
                    }
                } else {
                    message = error.response?.data?.error || error; // Default to full error if no specific message
                }
            } else if (error instanceof Error) {
                message = error; // Keep the entire Error object
            }
            setErrorMessage(message as RequestError);
        } finally {
            setIsLoading(false)
        }
    };

    console.log('error message ', errorMessage)

    return (
        <main className="h-[100vh] max-w-[900px] mx-auto">
            <ScrollToTop />
            <FormProgressBar progress={92} position={6} />

            {/* Show Loading screen first if necessary */}
            {isLoading &&
                <div className="flex flex-col mb-[175px] justify-center items-center">
                    <p className="text-center mb-[20px]">Processing your information...</p>
                    <NineDotsLoader />
                </div>
            }

            {/* Show Error screen */}
            {errorMessage &&
                <div className="flex flex-col items-center">
                    <p className="font-bold text-[var(--company-red)]">Error Making Final Documents:</p>
                    {errorMessage?.code === '413' ?
                        <>
                            <p className="text-center mx-10 italic mt-3">Your combined uploaded documents are too large. Update your files in</p>
                            <p className="text-center mx-10 italic mt-3 font-bold italic">&apos;Document Uploads&apos;.</p>
                            <p className="text-center mx-10 italic mt-3">Only include necessary files and pages.</p>
                        </>
                        :
                        <p className="text-center mx-10 italic mt-3">{errorMessage?.message}</p>
                    }
                </div>
            }

            {/* Show PDF if no errror and is done loading */}
            {pdfOne &&
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
            }
        </main>
    )
}
