import { Contact } from "@/types/Contact"
import SubmitButton from "./Buttons/SubmitButton"

interface Props {
    contact: Contact
    deleteHandler: (contact: Contact) => void
}


export default function ContactView({ contact, deleteHandler }: Props) {
    return (
        <section className="w-[340px] border border-[var(--company-gray)] rounded-sm mb-7 mx-2">
            <div className="flex flex-col justify-between items-center mb-2">
                <div className="py-1 px-2 bg-[var(--off-white)] w-full">
                    <div className="flex flex-wrap justify-between">
                        <p>{contact.name}</p>
                        <p 
                        className="text-[.9rem] text-[var(--company-red)] underline hover:cursor-pointer"
                        onClick={() => deleteHandler(contact)}
                        >Delete</p>
                    </div>
                    {/* <div className="flex flex-wrap justify-between"> */}
                        <p className="text-[.875rem] text-gray-500">{contact.email}</p>
                        {contact?.phone ? <p className="text-[.85rem] text-gray-500">{contact.phone}</p> : <p className="text-[.85rem] text-gray-500 italic">(No Phone)</p>}
                    {/* </div> */}
                </div>
            </div>
            {/* Contact type lists */}
            <div className="flex flex-wrap p-5 py-0">
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

                {/* <form onSubmit={(e) => deleteHandler(e, contact)}>
                    <SubmitButton
                        isLoading={false}
                        isSubmittable={true}
                        color="red"
                    >
                        Delete
                    </SubmitButton>
                </form> */}
            </div>
        </section>
    )
}
