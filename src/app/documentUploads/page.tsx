'use client';
import FormBlockHeading from '../components/Headings/FormBlockHeading'
import { saveFormData, getFormData, deleteField } from "../../../utils/indexedDBActions";
import { useState, useEffect } from 'react';
import { PDFFile } from '../../../types/pdf';
import { useRouter } from 'next/navigation';
import SaveAndContinueBtns from '../components/Buttons/SaveAndContinueBtns';
import { PulseLoader } from 'react-spinners';
import imageCompression from 'browser-image-compression';
import { IoMdCloseCircle } from "react-icons/io";
import FormProgressBar from '../components/FormProgressBar';
import { ToastContainer, toast } from 'react-toastify';
import ScrollToTop from '../components/ScrollToTop';
import { convertImageToPdf } from '../../../utils/convertImageToPdf';

export default function Page() {


    const router = useRouter();
    const [stateLicense, setStateLicense] = useState<PDFFile | null>(null);
    const [deaLicense, setDeaLicense] = useState<PDFFile | null>(null);
    const [letterHead, setLetterHead] = useState<PDFFile | null>(null);
    const [taxExceptionDocs, setTaxExceptionDocs] = useState<PDFFile | null>(null);
    const [otherDocument, setOtherDocument] = useState<PDFFile | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [isUpLoading, setIsUploading] = useState<boolean>(false)
    const [needsDEA, setNeedsDEA] = useState<boolean>(false)


    // Initial state for the Forms, Need to conditionally render false
    const possibleImageFilesInitialState = [
        { label: 'State License', state: stateLicense, isRequired: true, dbFieldName: 'stateLicense' },
        { label: 'DEA License', state: deaLicense, isRequired: false, dbFieldName: 'deaLicense' },
        { label: 'Letter Head', state: letterHead, isRequired: false, dbFieldName: 'letterHead' },
        { label: 'Tax Excemption Documents', state: taxExceptionDocs, isRequired: false, dbFieldName: 'taxExceptionDocuments' },
        { label: 'Other Document', state: otherDocument, isRequired: false, dbFieldName: 'otherDocument' },
    ];

    const [fileUploadFields, setFileUploadFields] = useState(possibleImageFilesInitialState)

    const notify = (message: string) => toast(message);

    // Initial fetch to data store
    useEffect(() => {
        const fetchData = async () => {
            const savedData = await getFormData(); // Fetch saved data from IndexedDB or any source
            if (savedData) {
                setStateLicense(savedData?.stateLicense || '')
                setDeaLicense(savedData?.deaLicense || '')
                setLetterHead(savedData?.letterHead || '')
                setTaxExceptionDocs(savedData?.taxExceptionDocs || '')
                setOtherDocument(savedData?.otherDocument || '')
            }
            // require DEA license if checked controlled substance
            if (savedData?.facilityInformation?.isRequiringDEA === 'Yes') setNeedsDEA(true)
        };
        fetchData();
    }, [])

    // use effect to updated the nested state variables. need this because neset state variables wont be tracked.
    useEffect(() => {
        setFileUploadFields([
            { label: 'State License', state: stateLicense, isRequired: true, dbFieldName: 'stateLicense' },
            { label: 'DEA License', state: deaLicense, isRequired: needsDEA, dbFieldName: 'deaLicense' },
            { label: 'Letter Head', state: letterHead, isRequired: false, dbFieldName: 'letterHead' },
            { label: 'Tax Excemption Documents', state: taxExceptionDocs, isRequired: false, dbFieldName: 'taxExceptionDocuments' },
            { label: 'Other Document', state: otherDocument, isRequired: false, dbFieldName: 'otherDocument' },
        ]);
    }, [stateLicense, deaLicense, letterHead, taxExceptionDocs, otherDocument, needsDEA]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            console.error("Please add a file");
            return;
        }

        try {
            setIsUploading(true);
            let fileToUpload = file;
            let fileType = file.type;
            let fileName = file.name;

            // Compress and convert images to PDF
            if (fileType.startsWith("image/")) {
                const options = {
                    maxSizeMB: 0.5,
                    maxWidthOrHeight: 450,
                    useWebWorker: true,
                };

                // Compress image
                const compressedFile = await imageCompression(file, options);
                fileToUpload = new File([await convertImageToPdf(compressedFile)], fileName.replace(/\.[^.]+$/, ".pdf"), {
                    type: "application/pdf",
                });
                fileType = "application/pdf";
                fileName = fileToUpload.name;
            }

            // Upload to S3
            const formData = new FormData();
            formData.append("file", fileToUpload);
            formData.append("key", `generated-pdfs/${Date.now()}-${fileName}`);

            const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/s3-upload`, {
                method: "POST",
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error("Failed to upload file.");
            }

            const { pdfUrl } = await uploadResponse.json();
            console.log("Uploaded file URL:", pdfUrl);

            // Set the correct state based on the input ID
            const fileData = { name: fileName, type: fileType, data:pdfUrl }; // Store only URL now

            switch (event.target.id) {
                case "state-license":
                    setStateLicense(fileData);
                    break;
                case "dea-license":
                    setDeaLicense(fileData);
                    break;
                case "letter-head":
                    setLetterHead(fileData);
                    break;
                case "tax-excemption-documents":
                    setTaxExceptionDocs(fileData);
                    break;
                case "other-document":
                    setOtherDocument(fileData);
                    break;
            }
        } catch (error) {
            console.error("Error processing file:", error);
        } finally {
            setIsUploading(false);
        }
    };


    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!stateLicense) {
            notify('Missing State License')
            return;
        }
        if (!deaLicense && needsDEA) {
            notify('Missing DEA License')
            return;
        }
        try {
            setIsSaving(true)
            await saveFormData({
                stateLicense,
                deaLicense,
                letterHead,
                taxExceptionDocs,
                otherDocument
            })
            router.push('/reviewInformation')
        } catch (error) {
            console.log('error submitting form', error)
        } finally {
            setIsSaving(false)
        }
    }

    async function handleSaveData() {
        try {
            setIsSaving(true)
            await saveFormData({
                stateLicense,
                deaLicense,
                letterHead,
                taxExceptionDocs,
                otherDocument
            })
            notify('Data Saved!');
        } catch (error) {
            console.log('error saving data', error)
        } finally {
            setIsSaving(false)
        }
    }

    async function deleteFileHandler(fieldName: string) {
        try {
            await deleteField(fieldName)
            switch (fieldName) {
                case 'stateLicense':
                    setStateLicense(null)
                    break;
                case 'deaLicense':
                    setDeaLicense(null)
                    break;
                case 'letterHead':
                    setLetterHead(null)
                    break;
                case 'taxExceptionDocuments':
                    setTaxExceptionDocs(null)
                    break;
                case 'otherDocument':
                    setOtherDocument(null)
                    break;
            }
        } catch (error) {

        }
    }

    return (
        <main className="h-[100vh] max-w-[900px] mx-auto">
            {isUpLoading &&
                <div className="flex items-center justify-center z-10 fixed top-0 bottom-0 left-0 right-0 pointer-events-auto bg-[rgba(0,0,0,0.9)]">
                    <div className='flex items-baseline justify-center mb-[175px]'>
                        <p className='text-[1.5rem] font-bold text-white mr-2'>Uploading File</p>
                        <PulseLoader
                            loading={true}
                            size={7}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                            color='white'
                        />
                    </div>
                </div>
            }
            <ScrollToTop />
            <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <FormProgressBar progress={75} position={5} />
            <FormBlockHeading headingText="Documents" />
            <form onSubmit={handleFormSubmit}>
                <section className="border-2 border-[var(--company-gray)] rounded-[3px] p-5 mx-5">
                    <p className='text-center text-[.95rem]'>
                        <span className='font-bold mr-1'>Acceptable Files:</span>
                        <span className="bg-gray-200 px-2 py-[2px] rounded-md mx-1">.jpeg</span>
                        <span className="bg-gray-200 px-2 py-[2px] rounded-md mx-1">.jpg</span>
                        <span className="bg-gray-200 px-2 py-[2px] rounded-md mx-1">.png</span>
                        <span className="bg-gray-200 px-2 py-[2px] rounded-md mx-1">.pdf</span>
                    </p>
                    {fileUploadFields?.map((fileOption, index) => (
                        <div key={index} className='mx-3 my-5 p-5 border border-gray-300 rounded-[3px] relative'>

                            <p className='font-bold'>{fileOption.label}: {fileOption.isRequired && <span className='text-[.95rem] text-[var(--company-red)]'>(required)</span>}</p>

                            <div className="flex items-center mb-5">
                                <p className='mr-5 text-[.95rem]'>File: {fileOption.state?.name ?
                                    <span>
                                        <span className='italic'>{fileOption.state.name}</span>
                                        <span onClick={() => deleteFileHandler(fileOption.dbFieldName)}><IoMdCloseCircle className='inline-block ml-2 text-[1.1rem] text-[var(--company-red)] hover:cursor-pointer hover:text-[var(--off-black)]' /></span>
                                    </span>
                                    :
                                    <span className='italic'>No File Selected</span>}</p>
                                <label
                                    className={`w-fit custom-small-btn bg-[var(--off-black)] absolute top-10 right-10`}
                                    htmlFor={fileOption.label.replace(/ /g, '-').toLocaleLowerCase()}
                                >
                                    {isUpLoading ?
                                        <PulseLoader
                                            loading={isUpLoading}
                                            size={7}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                            color='white'
                                        />
                                        :
                                        'Upload File'
                                    }
                                    <input
                                        id={fileOption.label.replace(/ /g, '-').toLocaleLowerCase()}
                                        type="file"
                                        accept=".jpeg,.png,.jpg, .pdf"
                                        className="mt-5"
                                        hidden
                                        name={fileOption.dbFieldName}
                                        onChange={(e) => handleFileChange(e)}
                                    />
                                </label>
                            </div>
                        </div>
                    ))}
                </section>
                <SaveAndContinueBtns
                    isSaving={isSaving}
                    submitHandler={handleSaveData}
                />
            </form>
        </main>
    )
}
