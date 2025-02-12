import { Contact } from "@/types/Contact"
import SubmitButton from "./Buttons/SubmitButton"

interface Props {
    contact: Contact
    deleteHandler: (e: React.FormEvent<HTMLFormElement>, contact:Contact) => void
}


export default function ContactView({ contact, deleteHandler }: Props) {
    return (
        <section className="w-[90%] mx-auto border border-[var(--company-gray)] rounded-sm p-5 mb-5">
            <div className="flex flex-wrap justify-between mb-5">
                <p
                    className="bg-[var(--off-white)] border border-[var(--off-white)] rounded-sm px-2 py-[1px]"
                >{contact.name}</p>
                <p>{contact.email}</p>
                {contact?.phone && <p>{contact.phone}</p>}
            </div>
            {/* Contact type lists */}
            <div className="flex flex-wrap">
                {contact?.type?.map((type, index) => {
                    return (
                        <p
                            key={index}
                            className="mr-5 my-2 text-[.9rem]"
                        >✅ {type.label}</p>
                    )
                })}
            </div>
            <div className="flex justify-center mt-4">
            <form onSubmit={(e) => deleteHandler(e, contact)}>
                <SubmitButton
                    isLoading={false}
                    isSubmittable={true}
                    color="red"
                >
                    Delete
                </SubmitButton>
            </form>
            </div>
        </section>
    )
}
