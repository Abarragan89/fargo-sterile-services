import InputLabelEl from "./InputLabelEl"
import { useState } from "react"
import { Contact } from "../../../../types/Contact"
import SubmitButton from "../Buttons/SubmitButton"
import SelectAreaEl from "./SelectAreaEl"
import { SelectItem } from "../../../../types/formInputs"
import { contactTypeOptions } from "../../../../data"
import { formatPhoneNumber } from "../../../../utils/formatPhoneNumber"

interface Props {
    updateStateHandler: (
        e: React.FormEvent<HTMLFormElement>,
        contact: Contact,
        contactType: SelectItem[],
        clearFormHandler: () => void
    ) => void

}

export default function ContactForm({ updateStateHandler }: Props) {

    const currentContactOriginalState = {
        id: '',
        name: '',
        email: '',
        phone: ''
    }

    const [currentContact, setCurrentContact] = useState<Contact>(currentContactOriginalState)

    const [contactType, setContactType] = useState<SelectItem[]>([])

    function handleContactChange(inputName: string, inputValue: string | undefined) {
        if (inputName === 'phone' && inputValue) {
            if (inputValue.length >= 15) return
            setCurrentContact(prev => ({ ...prev, [inputName]: formatPhoneNumber(inputValue) }))
            return
        }
        setCurrentContact(prev => ({ ...prev, [inputName]: inputValue }))
    }

    function clearForm() {
        setContactType([])
        setCurrentContact(currentContactOriginalState)
    }

    return (
        <form
            className="w-[420px] border border-[var(--company-gray)] rounded-sm p-5 px-10 md:mt-10 mx-2"
            onSubmit={(e) => { updateStateHandler(e, currentContact, contactType, clearForm) }}>
            <legend
                className="text-center text-[1.05rem] font-bold text-[var(--company-gray)] mb-2"
            >Add Contact</legend>

            {/* Input Fields (Name Email Phone) */}
            <div className='grid grid-cols-1 gap-2'>
                <div>
                    <InputLabelEl
                        labelText='Contact Name'
                        nameAndId='name'
                        handleStateChange={handleContactChange}
                        userText={currentContact.name}
                        required={true}
                    />
                </div>
                <div>
                    <InputLabelEl
                        labelText='Email'
                        nameAndId='email'
                        inputType="email"
                        handleStateChange={handleContactChange}
                        userText={currentContact.email}
                        required={true}
                    />
                </div>
                <div>
                    <InputLabelEl
                        labelText='Direct Phone'
                        inputType="tel"
                        nameAndId='phone'
                        placeholderText="(555) 555-5555"
                        title="(555) 555-5555"
                        pattern='^\(\d{3}\) \d{3}-\d{4}$'
                        handleStateChange={handleContactChange}
                        userText={currentContact.phone}
                        required={false}
                    />
                </div>
            </div>

            {/* Select Boxes */}
            <fieldset className="w-full mt-3">
                <label className="relative text-[.95rem]">Contact Type:<span className="text-[var(--company-red)] top-[-3px] absolute text-[1.3rem]">*</span></label>
                <div className="flex flex-wrap mx-auto border border-[var(--company-gray)] p-3 rounded-sm">
                    <SelectAreaEl
                        chosenSelectionOptionsArr={contactType}
                        setChosenSelectionOptionsArr={setContactType}
                        totalSelectionOptionsArr={contactTypeOptions}
                    />
                </div>
            </fieldset>
            {/* Submit Button */}
            <div className="flex justify-center mt-4">
                <SubmitButton
                    isLoading={false}
                    isSubmittable={true}
                    color="green"
                >
                    Add
                </SubmitButton>
            </div>
        </form>

    )
}
