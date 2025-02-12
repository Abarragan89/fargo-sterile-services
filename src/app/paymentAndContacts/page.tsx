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
    const [isSaving, setIsSaving] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState(paymentMethodInitialState)
    const [contactInfo, setContactInfo] = useState(contactInfoInitialState)
    const [isAllRequirementsMet, setIsAllRequirementsMet] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const savedData = await getFormData(); // Fetch saved data from IndexedDB or any source
            if (savedData) {
                setPaymentMethod(savedData?.paymentMethod || paymentMethodInitialState);
                setContactInfo(savedData?.contactInfo || contactInfoInitialState)
            }
            setIsLoading(false)
        };
        fetchData();
    }, [])

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setIsSaving(true)
            await saveFormData({ paymentMethod, contactInfo })
            // don't move forward if requirements not met
            if (!isAllRequirementsMet) {
                notify("Contact Requirements not met");
                return
            } else if (paymentMethod.paymentMethod === '') {
                notify("Choose a payment method");
                return
            }
            router.push('/statementOfClinicalDifference')
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
            notify("Data Saved!");
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
            notify("Contact Added!");
        } catch (error) {
            console.log('error saving data', error)
        } finally {
            setIsSaving(false)
        }
    }

    function deleteContact(contact: Contact) {
        try {
            const updatedContact = contactInfo.filter((currentContact) => currentContact.id !== contact.id)
            // set requirements to False, will be set to true if met in useEffect in contact form
            setIsAllRequirementsMet(false)
            setContactInfo(updatedContact)
            saveFormData({ contactInfo: updatedContact })
        } catch (error) {
            console.log('error deleting contact ', error)
        }
    }

    const notify = (message: string) => toast(message);

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
            <FormProgressBar progress={42} position={3} />

            {isLoading ?
                <p className='text-center'>Loading...</p>
                :
                <>
                    {/* Payment Form */}
                    <form onSubmit={(e) => handleFormSubmit(e)}>
                        <FormBlockHeading headingText="Payment" />
                        <div className="border-2 border-[var(--company-gray)] rounded-[3px] p-6 mx-8">
                            <RadioInputSection
                                category={paymentMethod.paymentMethod}
                                setCategories={handlePaymentChange}
                                radioOptions={paymentOptions}
                                isFlex={false}
                            />
                        </div>
                    </form>

                    {/* Contact Section */}
                    <FormBlockHeading headingText="Contacts" />
                    <div className="border-2 border-[var(--company-gray)] rounded-[3px] p-10 pt-0 mx-8">

                        <div className="flex flex-wrap justify-center">
                            {/* Contact Requirements */}
                            <ContactRequirements contactInfo={contactInfo} setAllRequirementsMet={setIsAllRequirementsMet} />

                            {/* Contact input fields */}
                            <ContactForm
                                updateStateHandler={handleSaveContact}
                            />
                        </div>
                        {/* Current Contacts */}
                        <h3
                            className="text-center text-[1.05rem] font-bold text-[var(--company-gray)] mx-5 mb-2 mt-[45px] pt-4 border-t border-[var(--company-gray)]"
                        >My Contacts</h3>
                        <div className='flex flex-wrap justify-center'>
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
                </>
            }

        </main>
    )
}