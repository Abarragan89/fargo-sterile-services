import InputLabelEl from "./InputLabelEl"
import { useState } from "react"
import { Contact } from "@/types/Contact"
import SubmitButton from "../Buttons/SubmitButton"
import SelectAreaEl from "./SelectAreaEl"
import { SelectItem } from "../../../../types/formInputs"
import { contactTypeOptions } from "../../../../data"

interface Props {
    updateStateHandler: (e: React.FormEvent<HTMLFormElement>, contact: Contact, contactType: SelectItem[]) => void

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
        setCurrentContact(prev => ({ ...prev, [inputName]: inputValue }))
    }

    function clearForm() {
        setContactType([])
        setCurrentContact(currentContactOriginalState)
    }

    return (
        <form
            className="border border-[var(--company-gray)] rounded-sm px-4 pb-4 pt-2 mx-auto"
            onSubmit={(e) => {updateStateHandler(e, currentContact, contactType); clearForm()}}>
            <legend
                className="text-center text-[1.05rem] font-bold text-[var(--company-gray)] mb-2"
            >Add Contact</legend>

            {/* Input Fields (Name Email Phone) */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
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
                        labelText='Phone'
                        inputType="tel"
                        nameAndId='phone'
                        handleStateChange={handleContactChange}
                        userText={currentContact.phone}
                        required={false}
                    />
                </div>
            </div>

            {/* Select Boxes */}
            <fieldset className="w-full mt-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 flex-wrap mx-auto">
                    <SelectAreaEl
                        chosenSelectionOptionsArr={contactType}
                        setChosenSelectionOptionsArr={setContactType}
                        totalSelectionOptionsArr={contactTypeOptions}
                    />
                </div>
            </fieldset>
            {/* Submit Button */}
            <div className="flex justify-center mt-2">
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
