'use client';
import FormBlockHeading from '../components/Headings/FormBlockHeading'
import { saveFormData, getFormData } from "../../../utils/indexedDBActions";
import { useState, useEffect } from 'react';
import { PDFFile } from '../../../types/pdf';
import { useRouter } from 'next/navigation';
import SaveAndContinueBtns from '../components/Buttons/SaveAndContinueBtns';
import { PulseLoader } from 'react-spinners';

export default function page() {

    const router = useRouter();
    const [stateLicense, setStateLicense] = useState<PDFFile | null>(null);
    const [deaLicense, setDeaLicense] = useState<PDFFile | null>(null);
    const [otherLicense, setOtherLicense] = useState<PDFFile | null>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [isUpLoading, setIsUploading] = useState<boolean>(false)

    useEffect(() => {
        const fetchData = async () => {
            const savedData = await getFormData(); // Fetch saved data from IndexedDB or any source
            if (savedData) {
                setStateLicense(savedData?.stateLicense || '')
                setDeaLicense(savedData?.deaLicense || '')
            }
        };
        fetchData();
    }, [])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            throw new Error('Please add a file');
        }

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
                case 'state-license':
                    setOtherLicense({
                        name: file.name,
                        type: file.type,
                        data: fileData,
                    });
                    break;
            }
        };
        reader.readAsDataURL(file);
    };

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSaving(true)
        await saveFormData({
            stateLicense,
            deaLicense
        })
        setIsSaving(false)
        router.push('/reviewInformation', { scroll: true })
    };

    async function handleSaveData() {
        setIsSaving(true)
        await saveFormData({
            stateLicense,
            deaLicense
        })
        setIsSaving(false)
    }

    return (
        <main className="h-[100vh] max-w-[900px] mx-auto">
            <FormBlockHeading headingText="Documents" />
            <form onSubmit={handleFormSubmit}>
                <section className="border-2 border-[var(--company-gray)] rounded-[3px] p-5 mx-5">
                    <p className='text-center text-[.95rem]'> <span className='font-bold mr-1'>Acceptable File Types:</span>.jpeg .jpg or .png. </p>
                    <p className='mb-4 text-center text-[.95rem]'>If you need to convert a pdf to one of these types, click <a href='https://www.adobe.com/acrobat/online/pdf-to-jpg.html' target='_blank' rel='noopener noreferrer' className='underline text-blue-700'>here</a></p>

                    <p className='font-bold'>State License: <span className='text-[.95rem] text-[var(--company-gray)]'>(required)</span></p>
                    <div className="flex items-center mb-5">
                        <p className='mr-5'>File: {stateLicense?.name ? <span className='italic'>{stateLicense.name}</span> : <span className='italic'>None Selected</span>}</p>
                        <label
                            className={`w-fit custom-small-btn bg-[var(--off-black)]`}
                            htmlFor="state-license"
                        >
                            {isUpLoading ?
                                <PulseLoader
                                    loading={isUpLoading}
                                    size={7}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                    className="text-[var(--off-white)]"
                                />
                                :
                                'Upload File'
                            }
                            <input
                                id="state-license"
                                type="file"
                                accept=".jpeg,.png,.jpg"
                                className="mt-5"
                                hidden
                                onChange={(e) => handleFileChange(e)}
                            />
                        </label>
                    </div>


                    <p className='font-bold'>DEA License: <span className='text-[.95rem] text-[var(--company-gray)]'>(required)</span></p>
                    <div className="flex items-center mb-5">
                        <p className='mr-5'>File: {deaLicense?.name ? <span className='italic'>{deaLicense.name}</span> : <span className='italic'>None Selected</span>}</p>
                        <label
                            className={`w-fit custom-small-btn bg-[var(--off-black)]`}
                            htmlFor="dea-license"
                        >
                            {isUpLoading ?
                                <PulseLoader
                                    loading={isUpLoading}
                                    size={7}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                    className="text-[var(--off-white)]"
                                />
                                :
                                'Upload File'
                            }
                            <input
                                id="dea-license"
                                type="file"
                                accept=".jpeg,.png,.jpg"
                                className="mt-5"
                                hidden
                                onChange={(e) => handleFileChange(e)}
                            />
                        </label>
                    </div>


                    <p className='font-bold'>Other License:</p>
                    <div className="flex items-center mb-5">
                        <p className='mr-5'>File: {otherLicense?.name ? <span className='italic'>{otherLicense.name}</span> : <span className='italic'>None Selected</span>}</p>
                        <label
                            className={`w-fit custom-small-btn bg-[var(--off-black)]`}
                            htmlFor="other-license"
                        >
                            {isUpLoading ?
                                <PulseLoader
                                    loading={isUpLoading}
                                    size={7}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                    className="text-[var(--off-white)]"
                                />
                                :
                                'Upload File'
                            }
                            <input
                                id="other-license"
                                type="file"
                                accept=".jpeg,.png,.jpg"
                                className="mt-5"
                                hidden
                                onChange={(e) => handleFileChange(e)}
                            />
                        </label>
                    </div>





                </section>
                <SaveAndContinueBtns
                    isSaving={isSaving}
                    submitHandler={handleSaveData}
                />
            </form>
        </main>
    )
}
