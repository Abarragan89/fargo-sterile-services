"use client";
import { useEffect, useState, useRef } from "react";
import { getFormData } from "../../../utils/indexedDBActions";
import ScrollToTop from "../components/ScrollToTop";
import FormBlockHeading from "@/app/components/Headings/FormBlockHeading"
import { jsPDF } from "jspdf";
import SubmitButton from "../components/Buttons/SubmitButton";
import Image from "next/image";
import { PDFDocument, rgb } from "pdf-lib";
import axios from "axios";

export default function Page() {

    const [clientInfo, setClientInfo] = useState()
    const [showThankYou, setShowThankYou] = useState<boolean>(false)
    // const doc = new jsPDF();

    // doc.text("Hello world!", 10, 10);

    // doc.rect(20, 20, 100, 100,)
    // doc.save("a4.pdf");

    // console.log('pdf ', doc)

    const firstPDFRef = useRef(null);

    // const generatePDF = async () => {
    //     if (firstPDFRef.current) {
    //         // const element = document.getElementById('pdf-content'); // The container to render
    //         const canvas = await html2canvas(firstPDFRef.current);
    //         console.log('canvas ', canvas)
    //         const imgData = canvas.toDataURL('image/png');
    //         const pdfWidth = pdf.internal.pageSize.getWidth();
    //         const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    //         pdf.addImage(imgData, 'PNG', 100, 100, pdfWidth, pdfHeight);
    //         // pdf.save('document.pdf');
    //     }
    // };
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


    // useEffect(() => {
    //     generatePDF();
    // }, [firstPDFRef?.current])

    console.log('clientInfo', clientInfo)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const url = "/pdfs/firstPDF.pdf"; // Replace with your PDF file path in the public folder
        const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

        // Load the existing PDF
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        const form = pdfDoc.getForm()

        // Modify the first page
        const pages = pdfDoc.getPages();

        const firstPage = pages[0];

        // Draw some text on the first page
        // @ts-expect-error: clienInfo could be undefined
        firstPage.drawText(clientInfo.accountNumber as string, {
            x: 50,
            y: 700,
            size: 20,
        });

        const pdfBytes = await pdfDoc.save();

        // Trigger download
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "modified.pdf";
        link.click();

    }

    async function sendMail() {
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
        }
    }

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
                    <form onSubmit={sendMail}
                        className="flex justify-center mt-4"
                    >

                        <SubmitButton
                            isLoading={false}
                            isSubmittable={true}
                            color="red"
                        >
                            Complete
                        </SubmitButton>
                    </form>
                </>
            }


            {/* <div id="pdf-content" className="w-full h-[100%]" ref={firstPDFRef}>
                <Image
                    src={'/images/companyLogo.png'}
                    width={50}
                    height={50}
                    alt={'company Logo'}
                    className="w-auto h-auto"
                />
                <p>Hey there</p>
            </div> */}
        </main>
    )
}
