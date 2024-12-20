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
import FinalCompletePDF from "../components/pdfTemplates/FinalCompletePDF";
import { pdf } from '@react-pdf/renderer';

export default function ReviewPage() {

    const selectionArr = [{ id: 'confirmCompletePDF', label: 'By clicking here, you affirm that the information provided above is accurate.' }]

    const router = useRouter();

    const [clientInfo, setClientInfo] = useState();
    const [chosenSelectionArr, setChosenSelectionArr] = useState<SelectItem[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [generatePDFURL, setGeneratePDFURL] = useState<string | null>(null);
    const [generatedPDFBlob, setGeneratedPDFBlob] = useState<Blob>()
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
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('pdf', generatedPDFBlob as Blob, 'GeneratedPDF.pdf'); // Attach the Blob with a name

            await axios.post('/api/sendEmail', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Working Code 
            // if (clientInfo)
            //     await axios.post('/api/sendEmail', {
            //         clientInfo
            //     }, {
            //         headers: {
            //             'Content-Type': 'application/json',
            //         }
            //     })



            router.push('/thankyou')
        } catch (error) {
            console.log('errror ', error)
        } finally {
            setIsLoading(false)
        }
    }

    const generatePdfForViewers = async () => {
        // const { data: pdf1 } = await axios.post('/api/generatePDF', {
        //     clientInfo
        // })
        const pdfBlob = await pdf(<FinalCompletePDF data={clientInfo} />).toBlob();

        // Set the blob data so I can send it in the sendMail
        // Create a URL for the Blob
        const blobUrl = URL.createObjectURL(pdfBlob);

        // Set the URL to the state to render in iframe
        setGeneratePDFURL(blobUrl);
        // Convert the Blob to an ArrayBuffer
        // const arrayBuffer = await pdfBlob.arrayBuffer();

        // // Convert the ArrayBuffer to a Base64 string
        // const uint8Array = new Uint8Array(arrayBuffer);
        // // const base64data = btoa(String.fromCharCode(...uint8Array));

        // // Create the PDF object
        // const pdfFile = {
        //     name: 'GeneratedPDF.pdf',  // File name
        //     data: base64data,          // Base64-encoded string
        //     type: 'application/pdf',   // MIME type
        // };

        // setCompletePDFToSend(pdfFile)
        // const base64Pdf = pdfFile.data;
        // // Decode Base64 into a Blob
        // const pdfBlob2 = new Blob([Uint8Array.from(atob(base64Pdf), (char) => char.charCodeAt(0))], {
        //     type: 'application/pdf',
        // });
        // // Create an Object URL for the Blob
        // const pdfUrl = URL.createObjectURL(pdfBlob2);

        // setPdfOne(pdfUrl)
    };

    return (
        <main className="h-[100vh] max-w-[1200px] mx-auto">
            <ScrollToTop />
            <FormBlockHeading headingText="Review Information" />

            {/* Conditionally render when user pdfs are made */}
            {/* {pdfOne ? */}
            <div className="w-full mx-auto pb-[100px]">
                <p className="text-center font-bold my-5">Confirm the following information is correct and confirm to complete.</p>

                {/* Complete PDF */}
                <div className="h-[600px] w-full max-w-[700px] mx-auto border-4 border-black">
                    <iframe src={generatePDFURL as string} width="100%" height="100%" />
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
            {/* : */}
            {/* <p className="text-center">loading...</p> */}
            {/* } */}
        </main>
    )
}
