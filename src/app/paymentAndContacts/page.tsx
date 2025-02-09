'use client';
import { useState } from 'react';
import ScrollToTop from '../components/ScrollToTop'
import FormProgressBar from '../components/FormProgressBar';
import { useRouter } from "next/navigation";
import { saveFormData } from '../../../utils/indexedDBActions';
import SaveAndContinueBtns from '../components/Buttons/SaveAndContinueBtns';
import { ToastContainer, toast } from 'react-toastify';

export default function Page() {

    const router = useRouter();
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [paymentContactData, setPaymentContactData] = useState()

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setIsSaving(true)
            await saveFormData({ paymentContactData })
            router.push('/creditApplication')
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
                paymentContactData
            })
            notify();
        } catch (error) {
            console.log('error saving data', error)
        } finally{
            setIsSaving(false)
        }
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
            <FormProgressBar progress={36} position={3} />

            <form onSubmit={(e) => handleFormSubmit(e)}>
                <label>Payment and Contacts</label>


                {/* Save and Continue Btn section */}
                <SaveAndContinueBtns
                    isSaving={isSaving}
                    submitHandler={handleSaveData}
                />
            </form>
        </main>
    )
}