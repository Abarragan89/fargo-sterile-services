'use client';
import { useState, useEffect } from 'react';
import ScrollToTop from '../components/ScrollToTop'
import FormProgressBar from '../components/FormProgressBar';
import { useRouter } from "next/navigation";
import { saveFormData } from '../../../utils/indexedDBActions';
import SaveAndContinueBtns from '../components/Buttons/SaveAndContinueBtns';
import { ToastContainer, toast } from 'react-toastify';
import FormBlockHeading from '../components/Headings/FormBlockHeading';
import RadioInputSection from '../components/FormInputs/RadioInputSection';
import { paymentOptions } from '../../../data';
import { getFormData } from '../../../utils/indexedDBActions';
import ContactForm from '../components/FormInputs/ContactForm';
import { Contact } from '@/types/Contact';
import { SelectItem } from '../../../types/formInputs';
import ContactView from '../components/ContactView';
import ContactRequirements from '../components/ContactRequirements';

export default function Page() {

    const paymentMethodInitialState = {
        paymentMethod: '',
    }
    const contactInfoInitialState: Contact[] = []

    const router = useRouter();
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [paymentMethod, setPaymentMethod] = useState(paymentMethodInitialState)
    const [contactInfo, setContactInfo] = useState(contactInfoInitialState)


    useEffect(() => {
        const fetchData = async () => {
            const savedData = await getFormData(); // Fetch saved data from IndexedDB or any source
            if (savedData) {
                setPaymentMethod(savedData?.paymentMethod || paymentMethodInitialState);
                setContactInfo(savedData?.contactInfo || contactInfoInitialState)
            }
        };
        fetchData();
    }, [])

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setIsSaving(true)
            await saveFormData({ paymentMethod, contactInfo })
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
                paymentMethod,
                contactInfo
            })
            notify();
        } catch (error) {
            console.log('error saving data', error)
        } finally {
            setIsSaving(false)
        }
    }

    function handlePaymentChange(inputName: string, inputValue: string | undefined) {
        setPaymentMethod(prev => ({ ...prev, [inputName]: inputValue }))
    }


    async function handleSaveContact(e: React.FormEvent<HTMLFormElement>, newContact: Contact, contactType: SelectItem[]) {
        e.preventDefault();

        // Add the contact type to the contact object
        newContact.type = contactType
        newContact.id = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
        const updatedContactInfo = [newContact, ...contactInfo]

        // Update the state
        setContactInfo(updatedContactInfo);

        // Save the Data to the DataBase
        try {
            setIsSaving(true)
            await saveFormData({ contactInfo: updatedContactInfo })
            addedContactNotify();
        } catch (error) {
            console.log('error saving data', error)
        } finally {
            setIsSaving(false)
        }
    }

    function deleteContact(e: React.FormEvent<HTMLFormElement>, contact: Contact) {
        e.preventDefault();
        try {
            const updatedContact = contactInfo.filter((currentContact) => currentContact.id !== contact.id)
            setContactInfo(updatedContact)
            saveFormData({ contactInfo: updatedContact})
        } catch (error) {
            console.log('error deleting contact ', error)
        }
    }

    const notify = () => toast("Data Saved!");
    const addedContactNotify = () => toast('Added Contact')

    return (
        <main className="h-[100vh] max-w-[750px] mx-auto">
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

            {/* Payment Form */}
            <form onSubmit={(e) => handleFormSubmit(e)}>
                <FormBlockHeading headingText="Payment" />
                <div className="border-2 border-[var(--company-gray)] rounded-[3px] p-5 mx-5">
                    <RadioInputSection
                        category={paymentMethod.paymentMethod}
                        setCategories={handlePaymentChange}
                        radioOptions={paymentOptions}
                    />
                </div>
            </form>

            {/* Contact Requirements Requirements */}
            <FormBlockHeading headingText="Contacts" />
            <div className="border-2 border-[var(--company-gray)] rounded-[3px] p-5 mx-5">
                {/* Contact Requirements */}
                <ContactRequirements contactInfo={contactInfo}/>

                {/* Contact input fields */}
                <div className="mt-4">
                    <ContactForm
                        updateStateHandler={handleSaveContact}
                    />
                </div>

                {/* Current Contacts */}
                <h3
                    className="text-center text-[1.05rem] font-bold text-[var(--company-gray)] mb-2 mt-5"
                >My Contacts</h3>
                <div>
                    {contactInfo?.length > 0 ? contactInfo?.map((contact, index) =>
                        <ContactView key={index} contact={contact} deleteHandler={deleteContact} />)
                        :
                        <p className='text-center'>No Contacts Added</p>
                    }
                </div>


            </div>

            {/* Form to save the payment and everything else on page. */}
            <form onSubmit={(e) => (handleFormSubmit(e))}>
                {/* Save and Continue Btn section */}
                <SaveAndContinueBtns
                    isSaving={isSaving}
                    submitHandler={handleSaveData}
                />
            </form>
        </main>
    )
}