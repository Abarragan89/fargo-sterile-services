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

export default function Page() {

    const router = useRouter();
    const [stateLicense, setStateLicense] = useState<PDFFile | null>(null);
    const [deaLicense, setDeaLicense] = useState<PDFFile | null>(null);
    const [otherLicense1, setOtherLicense1] = useState<PDFFile | null>(null);
    const [otherLicense2, setOtherLicense2] = useState<PDFFile | null>(null);
    const [otherLicense3, setOtherLicense3] = useState<PDFFile | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [isUpLoading, setIsUploading] = useState<boolean>(false)
    const notify = () => toast("Data Saved!");


    useEffect(() => {
        const fetchData = async () => {
            const savedData = await getFormData(); // Fetch saved data from IndexedDB or any source
            if (savedData) {
                setStateLicense(savedData?.stateLicense || '')
                setDeaLicense(savedData?.deaLicense || '')
                setOtherLicense1(savedData?.otherLicense1 || '')
                setOtherLicense2(savedData?.otherLicense2 || '')
                setOtherLicense3(savedData?.otherLicense3 || '')
            }
        };
        fetchData();
    }, [])

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            throw new Error('Please add a file');
        }
        try {
            setIsUploading(true)
            const options = {
                maxSizeMB: .5,
                maxWidthOrHeight: 400,
                useWebWorker: true,
            }
            // compress the file
            const compressedFile = await imageCompression(file, options);

            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                // @ts-expect-error: error getting 
                const fileData = readerEvent.target.result.split(',')[1];
                switch (event.target.id) {
                    case 'state-license':
                        setStateLicense({
                            name: file.name,
                            type: file.type,
                            data: fileData,
                        });
                        break;
                    case 'dea-license':
                        setDeaLicense({
                            name: file.name,
                            type: file.type,
                            data: fileData,
                        });
                        break;
                    case 'other-license-1':
                        setOtherLicense1({
                            name: file.name,
                            type: file.type,
                            data: fileData,
                        });
                        break;
                    case 'other-license-2':
                        setOtherLicense2({
                            name: file.name,
                            type: file.type,
                            data: fileData,
                        });
                        break;
                    case 'other-license-3':
                        setOtherLicense3({
                            name: file.name,
                            type: file.type,
                            data: fileData,
                        });
                        break;
                }
            };
            reader.readAsDataURL(compressedFile);
        } catch (error) {
            console.log('error compresssion image ', error)
        } finally {
            setIsUploading(false)
        }
    };


    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setIsSaving(true)
            await saveFormData({
                stateLicense,
                deaLicense,
                otherLicense1,
                otherLicense2,
                otherLicense3
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
                otherLicense1,
                otherLicense2,
                otherLicense3
            })
            notify();
        } catch (error) {
            console.log('error saving data', error)
        } finally {
            setIsSaving(false)
        }
    }

    const possibleImageFiles = [
        { label: 'State License', state: stateLicense, isRequired: true, dbFieldName: 'stateLicense' },
        { label: 'DEA License', state: deaLicense, isRequired: true, dbFieldName: 'deaLicense' },
        { label: 'Other License 1', state: otherLicense1, isRequired: false, dbFieldName: 'otherLicense1' },
        { label: 'Other License 2', state: otherLicense2, isRequired: false, dbFieldName: 'otherLicense2' },
        { label: 'Other License 3', state: otherLicense3, isRequired: false, dbFieldName: 'otherLicense3' },
    ];

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
                case 'otherLicense1':
                    setOtherLicense1(null)
                    break;
                case 'otherLicense2':
                    setOtherLicense2(null)
                    break;
                case 'otherLicense3':
                    setOtherLicense3(null)
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
                        <p className='text-[1.5rem] font-bold text-white mr-2'>Compressing image </p>
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
                    <p className='text-center text-[.95rem]'> <span className='font-bold mr-1'>Acceptable File Types:</span>.jpeg .jpg or .png. </p>
                    <p className='text-center text-[.9rem]'>(If you need to convert a <span className='underline'>pdf</span> to an <span className='underline'>image</span> , click <a href='https://www.freeconvert.com/pdf-to-jpg' target='_blank' rel='noopener noreferrer' className='underline text-blue-700'>here</a>.)</p>
                    {possibleImageFiles.map((fileOption, index) => (
                        <div key={index} className='ml-3 my-5 p-5 border border-gray-300 rounded-[3px] relative'>

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
                                        accept=".jpeg,.png,.jpg"
                                        className="mt-5"
                                        hidden
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
