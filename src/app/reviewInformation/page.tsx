"use client";
import { useEffect, useState } from "react";
import { deleteField, getFormData } from "../../../utils/indexedDBActions";
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
    const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false)
    const [salesPersonId, setSalesPersonId] = useState('')
    const [errorMessage, setErrorMessage] = useState<RequestError>()
    const [facilityName, setFacilityName] = useState('')

    const [pdfUrls, setPdfUrls] = useState<{ url: string, documentType: string, displayName: string }[]>([])

    // Get the data from IndexedDB
    useEffect(() => {
        const fetchData = async () => {
            const allClientInfo = await getFormData(); // Fetch saved data from IndexedDB or any source
            if (allClientInfo) {
                setClientInfo(allClientInfo);
                setSalesPersonId(allClientInfo.salesPersonId)
                setFacilityName(allClientInfo.facilityInformation.facilityName)
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
        setIsSendingEmail(true);
        try {
            const formData = new FormData();
            formData.append('pdfUrls', JSON.stringify(pdfUrls));
            formData.append('salesPersonId', salesPersonId);
            formData.append('facilityName', facilityName)

            await axios.post('/api/sendEmail', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const indexedDBfieldsToDelete = ['stateLicense', 'deaLicense', 'letterHead', 'taxExceptionDocs', 'otherDocument']
            for (const item of indexedDBfieldsToDelete) {
                await deleteField(item)
            }
            router.push('/thankyou');
        } catch (error) {
            console.error('Error sending email:', error);
        } finally {
            setIsSendingEmail(false);
        }
    }



    const generatePdfForViewers = async () => {
        try {
            setIsLoading(true)
            const { data } = await axios.post('/api/generatePDF', { clientInfo });
            // setPdfUrl(data.url)
            setPdfUrls(data.urls)
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
            {errorMessage && !isLoading &&
                <div className="flex flex-col items-center">
                    <p className="font-bold text-[var(--company-red)]">Error Making Final Documents:</p>
                    {errorMessage?.code === '413' ?
                        <>
                            <p className="text-center mx-10 italic mt-3">Your combined uploaded documents are too large.</p>
                            <p className="text-center mx-10 italic mt-1">Update your files in:</p>
                            <p className="text-center mx-10 italic mt-2 font-bold">&apos;Document Uploads&apos;.</p>
                            <p className="text-center mx-10 italic mt-2">Only include necessary files and pages.</p>
                        </>
                        :
                        <p className="text-center mx-10 italic mt-3">{errorMessage?.message}</p>
                    }
                </div>
            }

            {/* Show PDF if no errror and is done loading */}
            {pdfUrls && !isLoading &&
                <>
                    <FormBlockHeading headingText="Confirm the following information is correct and complete." />
                    <div className="w-full pb-[100px]">
                        {/* <p className="text-center font-bold mt-[-5px] mb-3">Confirm the following information is correct and complete.</p> */}
                        <div className="mx-auto">
                            {pdfUrls?.map((pdfData, index) => (
                                <>
                                    <h3 key={pdfData.url} className="text-center font-bold mt-3 mb-1 text-[1.2rem]">{pdfData.displayName}</h3>
                                    <iframe key={index} src={pdfData?.url} className="border-4 border-black h-[600px] w-10/12 mx-auto mb-10" />
                                </>
                            ))}
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
                                isLoading={isSendingEmail}
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
