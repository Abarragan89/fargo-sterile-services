'use client';
import { useState, useEffect } from 'react';
import ScrollToTop from '../components/ScrollToTop'
import FormProgressBar from '../components/FormProgressBar';
import { useRouter } from "next/navigation";
import SaveAndContinueBtns from '../components/Buttons/SaveAndContinueBtns';
import { ToastContainer, toast } from 'react-toastify';
import RadioInputSection from '../components/FormInputs/RadioInputSection';
import { clinicalDifferenceRadioOptions } from '../../../data';
import { saveFormData, getFormData } from "../../../utils/indexedDBActions";
import InputLabelEl from '../components/FormInputs/InputLabelEl';

export default function Page() {

    const router = useRouter();
    const [isSaving, setIsSaving] = useState<boolean>(false)

    const originalFormState = {
        facilityAmount: '',
        facilityName: '',
        signerName: '',
        signerTitle: '',
        signatureDate: '',
        signature: ''
    }
    const [clinicalDifference, setClinicalDifference] = useState(originalFormState)

    useEffect(() => {
        const fetchData = async () => {
            const savedData = await getFormData(); // Fetch saved data from IndexedDB or any source
            if (savedData) {
                setClinicalDifference(savedData?.clinicalDifference || originalFormState);
            }
        };
        fetchData();
    }, [])

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setIsSaving(true)
            await saveFormData({ clinicalDifference })
            router.push('/documentUploads')
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
                clinicalDifference
            })
            notify();
        } catch (error) {
            console.log('error saving data', error)
        } finally {
            setIsSaving(false)
        }
    }

    console.log('clickcal difference ', clinicalDifference)

    function handleFacilityInfoChange(inputName: string, inputValue: string | undefined) {
        setClinicalDifference(prev => ({ ...prev, [inputName]: inputValue }))
    }

    const notify = () => toast("Data Saved!");

    return (
        <main className="h-[100vh] max-w-[900px] mx-auto">
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
            <FormProgressBar progress={65} position={5} />

            <div className='max-w-[700px] mx-auto'>
                {/* Complete PDF */}
                <div className="h-[600px] w-full mx-auto border-4 border-black">
                    <iframe src={'pdfs/statementOfClinicalDifference.pdf'} width="100%" height="100%" />
                </div>

                <form onSubmit={(e) => handleFormSubmit(e)}>
                    <p className='text-center py-4 my-4 border-b border-[var(--company-gray)] font-bold'>Please complete and sign below as acknowledgement and confirmation of the applicable statement of clinical difference corresponding to the above preparations.
                    </p>
                    {/* Radio selection for the amount of facilities */}
                    <RadioInputSection
                        category={clinicalDifference.facilityAmount}
                        setCategories={handleFacilityInfoChange}
                        radioOptions={clinicalDifferenceRadioOptions}
                    />
                    {/*  Input fields */}
                    <InputLabelEl
                        userText={clinicalDifference.facilityName}
                        nameAndId='facilityName'
                        handleStateChange={handleFacilityInfoChange}
                        labelText='Facility Name'
                        required={true}
                    />
                    <div className="flex justify-between mt-6">
                        <div className='w-full mr-2'>
                            <InputLabelEl
                                userText={clinicalDifference.signerName}
                                nameAndId='signerName'
                                handleStateChange={handleFacilityInfoChange}
                                labelText='Name'
                                required={true}
                            />
                        </div>
                        <div className='w-full ml-2'>
                            <InputLabelEl
                                userText={clinicalDifference.signerTitle}
                                nameAndId='signerTitle'
                                handleStateChange={handleFacilityInfoChange}
                                labelText='Title'
                                required={true}
                            />
                        </div>
                    </div>
                    <div className='flex mt-6'>
                        <div className='w-full mr-2'>
                            <InputLabelEl
                                userText={clinicalDifference.signerName}
                                nameAndId='signature'
                                handleStateChange={handleFacilityInfoChange}
                                labelText='Signature'
                                isSignature={true}
                                isDisabled={true}
                            />
                        </div>
                        <div className='w-full ml-2'>
                            <InputLabelEl
                                userText={clinicalDifference.signatureDate}
                                nameAndId='signatureDate'
                                handleStateChange={handleFacilityInfoChange}
                                labelText='Date'
                                required={true}
                                inputType='Date'
                            />
                        </div>
                    </div>
                    {/* Save and Continue Btn section */}
                    <SaveAndContinueBtns
                        isSaving={isSaving}
                        submitHandler={handleSaveData}
                    />
                </form>
            </div>



        </main>
    )
}