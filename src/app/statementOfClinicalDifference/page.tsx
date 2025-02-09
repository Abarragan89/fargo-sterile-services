'use client';
import { useState } from 'react';
import ScrollToTop from '../components/ScrollToTop'
import FormProgressBar from '../components/FormProgressBar';
import { useRouter } from "next/navigation";
import { saveFormData } from '../../../utils/indexedDBActions';
import SaveAndContinueBtns from '../components/Buttons/SaveAndContinueBtns';
import { ToastContainer, toast } from 'react-toastify';
import RadioInputSection from '../components/FormInputs/RadioInputSection';
import { clinicalDifferenceRadioOptions } from '../../../data';

export default function Page() {

    const router = useRouter();
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [clinicalDifference, setClinicalDifference] = useState({
        facilityAmount: '',
        facilityName: '',
        signerName: '',
        signerTitle: '',
        signatureDate: '',
    })

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setIsSaving(true)
            await saveFormData({ clinicalDifferenceRadioOptions })
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
                clinicalDifferenceRadioOptions
            })
            notify();
        } catch (error) {
            console.log('error saving data', error)
        } finally {
            setIsSaving(false)
        }
    }

    console.log('clickcal difference ', clinicalDifference)

    function handleFacilityInfoChange(inputText: string, label: string | undefined) {
        if (!label) return;
        setClinicalDifference(prev => ({ ...prev, [inputText]: label }))
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
                    <p className='text-center mt-5'>Please complete and sign below as acknowledgement and confirmation of the applicable statement of clinical difference corresponding to the above preparations.
                    </p>
                    <RadioInputSection
                        category={clinicalDifference.facilityAmount}
                        setCategories={handleFacilityInfoChange}
                        radioOptions={clinicalDifferenceRadioOptions}
                    />
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