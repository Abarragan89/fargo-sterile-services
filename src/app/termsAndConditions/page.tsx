'use client';
import { useState, useEffect } from "react";
import FormBlockHeading from "@/app/components/Headings/FormBlockHeading"
import InputLabelEl from "../components/FormInputs/InputLabelEl";
import SelectAreaEl from "../components/FormInputs/SelectAreaEl";
import { SelectItem } from "../../../types/formInputs";
import SubmitButton from "../components/Buttons/SubmitButton";
import { getFormData, saveFormData } from "../../../utils/indexedDBActions";
import ScrollToTop from "../components/ScrollToTop";
import { useRouter } from "next/navigation";
import FormProgressBar from "../components/FormProgressBar";

export default function Page() {

    const router = useRouter();
    const selectionArr = [{ id: 'agreeToTerms', label: 'By clicking here, you agree to the Terms and Conditions above.' }]

    const [chosenSelectionArr, setChosenSelectionArr] = useState<SelectItem[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const originalFormState = {
        fullName: '',
        jobTitle: '',
        date: ''
    }

    const [termsAndConditionsInformation, setTermsAndConditionInformation] = useState(originalFormState)

    useEffect(() => {
        const fetchData = async () => {
            const { termsAndConditionsInformation } = await getFormData(); // Fetch saved data from IndexedDB or any source
            if (termsAndConditionsInformation) {
                setTermsAndConditionInformation(termsAndConditionsInformation || originalFormState);
            }
        };
        fetchData();
    }, [])

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true)
        await saveFormData({ termsAndConditionsInformation })
        setIsLoading(false)
        router.push('/paymentAndContacts')
    }
    function handleTermsAndConditions(inputName: string, inputValue: string | undefined) {
        if (!inputValue) return;
        setTermsAndConditionInformation(prev => ({ ...prev, [inputName]: inputValue }))
    }

    const orderedListItem = "list-decimal ml-2 pl-2 py-2 text-[.95rem]";
    return (
        <main className="h-[100vh] max-w-[900px] mx-auto">
            <ScrollToTop />
            <FormProgressBar progress={21} position={2}/>
            <FormBlockHeading headingText="Terms and Conditions" />
            <div className=" border-2 border-[var(--company-gray)] rounded-[3px] p-8 mx-5 max-h-[500px] overflow-y-scroll">
                <p className="mb-2 text-[.95rem]">The person signing this section warrants on behalf of Customer that the above information is complete and accurate and
                    hereby agrees to the following Terms and Conditions:</p>
                <ol className="ml-6">
                    <li className={orderedListItem}>
                        Standard payment terms are Net 30 from invoice date.
                    </li>
                    <li className={orderedListItem}>
                        $7500 credit limit upon completion of Fagron&apos;s credit application; additional information may be required
                        for higher limits. Completion of separate credit application is mandatory for account set up.
                    </li>
                    <li className={orderedListItem}>
                        All orders are considered final when product has left the Seller&apos;s facility. No refunds or returns after shipment.
                    </li>
                    <li className={orderedListItem}>
                        Customer agrees to immediately notify Seller of any change in ownership, form or business name of the entity.
                    </li>
                    <li className={orderedListItem}>
                        This document will be as effective in photocopy or fax form as in the original.
                    </li>
                    <li className={orderedListItem}>
                        Customer acknowledges and agrees that services may be provided by Fagron Sterile Services or an affiliate.
                    </li>
                    <li className={orderedListItem}>
                        Customer acknowledges that Seller may limit or discontinue credit at its sole discretion and that the continued
                        extension of credit may require additional information.
                    </li>
                    <li className={orderedListItem}>
                        Customer agrees that if any invoice is not paid when due, late charges will accrue at the rate of 1.5% per month
                        or the maximum rate allowed by law, whichever is less. If legal action is taken to pursue collection, jurisdiction
                        shall be the State of Texas and the venue shall be Travis County, Texas. The Customer agrees to reimburse
                        Seller for any attorney fees, court costs or other costs of collection which may be incurred in its efforts to
                        collect any past due debts.
                    </li>
                    <li className={orderedListItem}>
                        In the event of an effective contract with terms that differ from the above, the effective contract will govern.
                    </li>
                </ol>

                <hr className="border-[var(--company-gray)] mt-5"></hr>
                <p className="mt-2 text-[.95rem] text-center font-bold">Acknowledgement</p>
                <form
                    onSubmit={(e) => handleFormSubmit(e)}>
                    <div className="w-full">
                        <SelectAreaEl
                            totalSelectionOptionsArr={selectionArr}
                            chosenSelectionOptionsArr={chosenSelectionArr}
                            setChosenSelectionOptionsArr={setChosenSelectionArr}
                        />
                    </div>

                    <div className="flex flex-wrap">
                        <div className="mr-3 flex-1">
                            <InputLabelEl
                                labelText="Full Name"
                                autocomplete={false}
                                nameAndId="fullName"
                                userText={termsAndConditionsInformation.fullName}
                                handleStateChange={handleTermsAndConditions}
                            />
                        </div>

                        <div className="ml-3 flex-1">
                            <InputLabelEl
                                labelText="Job Title"
                                nameAndId="jobTitle"
                                userText={termsAndConditionsInformation.jobTitle}
                                handleStateChange={handleTermsAndConditions}
                            />
                        </div>
                        <div>
                            <div className="ml-3 w-[130px]">
                                <InputLabelEl
                                    labelText="Date"
                                    inputType="date"
                                    nameAndId="date"
                                    userText={termsAndConditionsInformation.date}
                                    handleStateChange={handleTermsAndConditions}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center w-full mt-6">
                            <SubmitButton
                                isLoading={isLoading}
                                isSubmittable={
                                    chosenSelectionArr.length > 0 &&
                                    termsAndConditionsInformation.date !== '' &&
                                    termsAndConditionsInformation.jobTitle !== '' &&
                                    termsAndConditionsInformation.fullName !== ''
                                }
                            >
                                Agree to Terms
                            </SubmitButton>
                        </div>
                    </div>

                </form>
            </div>
        </main>
    )
}
