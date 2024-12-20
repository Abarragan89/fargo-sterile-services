'use client';
import FormBlockHeading from '../components/Headings/FormBlockHeading'
import { saveFormData, getFormData } from "../../../utils/indexedDBActions";
import { useState, useEffect } from 'react';
import { PDFFile } from '../../../types/pdf';
import { useRouter } from 'next/navigation';
import SaveAndContinueBtns from '../components/Buttons/SaveAndContinueBtns';
import { PulseLoader } from 'react-spinners';
import imageCompression from 'browser-image-compression';

export default function Page() {

    const router = useRouter();
    const [stateLicense, setStateLicense] = useState<PDFFile | null>(null);
    const [deaLicense, setDeaLicense] = useState<PDFFile | null>(null);
    const [otherLicense1, setOtherLicense1] = useState<PDFFile | null>(null);
    const [otherLicense2, setOtherLicense2] = useState<PDFFile | null>(null);
    const [otherLicense3, setOtherLicense3] = useState<PDFFile | null>(null);
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

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            throw new Error('Please add a file');
        }
        try {
            console.log('event id ', event.target.id)
            setIsUploading(true)
            const options = {
                maxSizeMB: .5,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            }
            // compress the file
            const compressedFile = await imageCompression(file, options);
            console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`)

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
        setIsSaving(true)
        await saveFormData({
            stateLicense,
            deaLicense,
            otherLicense1,
            otherLicense2,
            otherLicense3
        })
        setIsSaving(false)
        router.push('/reviewInformation', { scroll: true })
    };

    async function handleSaveData() {
        setIsSaving(true)
        console.log('other license 1 ', otherLicense1)
        await saveFormData({
            stateLicense,
            deaLicense,
            otherLicense1,
            otherLicense2,
            otherLicense3
        })
        setIsSaving(false)
    }

    const possibleImageFiles = ['State License', 'DEA License', 'Other License 1', 'Other License 2', 'Other License 3']

    return (
        <main className="h-[100vh] max-w-[900px] mx-auto">
            {isUpLoading &&
                <div className="flex items-center justify-center z-10 absolute top-0 bottom-0 left-0 right-0 pointer-events-auto bg-[rgba(0,0,0,0.9)]">
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
            <FormBlockHeading headingText="Documents" />
            <form onSubmit={handleFormSubmit}>
                <section className="border-2 border-[var(--company-gray)] rounded-[3px] p-5 mx-5">
                    <p className='text-center text-[.95rem]'> <span className='font-bold mr-1'>Acceptable File Types:</span>.jpeg .jpg or .png. </p>
                    <p className='mb-4 text-center text-[.95rem]'>If you need to convert a pdf to one of these types, click <a href='https://www.freeconvert.com/pdf-to-jpg' target='_blank' rel='noopener noreferrer' className='underline text-blue-700'>here</a></p>


                    {possibleImageFiles.map((fileOption, index) => (
                        <div key={index}>
                            <p className='font-bold'>{fileOption}: <span className='text-[.95rem] text-[var(--company-red)]'>(required)</span></p>
                            <div className="flex items-center mb-5">
                                <p className='mr-5'>File: {stateLicense?.name ? <span className='italic'>{stateLicense.name}</span> : <span className='italic'>None Selected</span>}</p>
                                <label
                                    className={`w-fit custom-small-btn bg-[var(--off-black)]`}
                                    htmlFor={fileOption.replace(/ /g, '-').toLocaleLowerCase()}
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
                                        id={fileOption.replace(/ /g, '-').toLocaleLowerCase()}
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


                    {/* <p className='font-bold'>DEA License: <span className='text-[.95rem] text-[var(--company-red)]'>(required)</span></p>
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
                                    color='white'
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
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
                                    color='white'
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
                    </div> */}



                </section>
                <SaveAndContinueBtns
                    isSaving={isSaving}
                    submitHandler={handleSaveData}
                />
            </form>
        </main>
    )
}
