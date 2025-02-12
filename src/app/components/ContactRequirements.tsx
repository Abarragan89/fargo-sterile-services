import { useState, useEffect } from "react"
import { Contact } from "@/types/Contact"

export default function ContactRequirements({ contactInfo }: { contactInfo: Contact[] }) {

    const requirementsMetInitialState = {
        businessContact: false,
        invoiceEmails: false,
        orderConfirmation: false,
        webShopAccess: false,
        apContact: false,
    }

    const [requirementsMet, setRequirementsMet] = useState(requirementsMetInitialState)
    const [isTwoEmails, setIsTwoEmails] = useState(false)
    const [isAllContactsProvided, setIsAllContactsProvided] = useState(false)

    function checkRequirements() {
        // Get first email to compare with rest of emails
        const firstEmail = contactInfo[0].email
        const isTwoUniqueEmails = contactInfo.some(contact => contact.email !== firstEmail)
        setIsTwoEmails(isTwoUniqueEmails)

        // Reset values every time for rerender on delete
        setRequirementsMet(requirementsMetInitialState);
        contactInfo.forEach((contact) => {
            console.log('contact info ', contactInfo)
            contact.type?.forEach((type) => {
                switch (type.id) {
                    case 'business-contact':
                        setRequirementsMet(prev => ({ ...prev, businessContact: true }))
                        break;
                    case 'invoice-emails':
                        setRequirementsMet(prev => ({ ...prev, invoiceEmails: true }))
                        break;
                    case 'web-shop-access':
                        setRequirementsMet(prev => ({ ...prev, webShopAccess: true }))
                        break;
                    case 'ap-contact':
                        setRequirementsMet(prev => ({ ...prev, apContact: true }))
                        break;
                    case 'order-confirmation-emails':
                        setRequirementsMet(prev => ({ ...prev, orderConfirmation: true }))
                        break;
                }
            })
        })
    }

    useEffect(() => {
        // Check if all contacts have been met
        const isAllContactsMet = Object.values(requirementsMet).every(value => value === true)
        setIsAllContactsProvided(isAllContactsMet)
    }, [requirementsMet])

    // useEffect to check for requirements
    useEffect(() => {
        if (contactInfo.length > 0) {
            checkRequirements()
        } else {
            setRequirementsMet(requirementsMetInitialState)
            setIsTwoEmails(false)
            setIsAllContactsProvided(false)
        }
    }, [contactInfo])

    const listItemsStyles = 'ml-5 my-1'

    return (
        <div className="border border-[var(--company-gray)] rounded-sm px-4 pb-4 pt-2 mx-auto">
            <h3
                className="text-center text-[1.05rem] font-bold text-[var(--company-gray)] mb-2"
            >Requirements Met</h3>
            <p>
                {isTwoEmails ?
                    <span className='text-[var(--success)] text-[1.25rem] mr-1'>&#x2713;</span>
                    :
                    <span className='text-[var(--company-red)] text-[1.25rem] mr-1'>&#x2717;</span>
                }
                <strong>Two different contacts and email addresses are required for every account.</strong>
            </p>
            <p>
                {isAllContactsProvided ?
                    <span className='text-[var(--success)] text-[1.25rem] mr-1'>&#x2713;</span>
                    :
                    <span className='text-[var(--company-red)] text-[1.25rem] mr-1'>&#x2717;</span>
                }
                <strong>There must be at least one contact (with email) identified for each:</strong>
            </p>
            <ul>
                <li className={listItemsStyles}>
                    {requirementsMet?.businessContact ?
                        <span className='text-[var(--success)] text-[1.25rem] mr-1'>&#x2713;</span>
                        :
                        <span className='text-[var(--company-red)] text-[1.25rem] mr-1'>&#x2717;</span>
                    }
                    Business Contact
                </li>
                <li className={listItemsStyles}>
                    {requirementsMet?.invoiceEmails ?
                        <span className='text-[var(--success)] text-[1.25rem] mr-1'>&#x2713;</span>
                        :
                        <span className='text-[var(--company-red)] text-[1.25rem] mr-1'>&#x2717;</span>
                    }
                    Invoice Emails
                </li>
                <li className={listItemsStyles}>
                    {requirementsMet?.orderConfirmation ?
                        <span className='text-[var(--success)] text-[1.25rem] mr-1'>&#x2713;</span>
                        :
                        <span className='text-[var(--company-red)] text-[1.25rem] mr-1'>&#x2717;</span>
                    }
                    Order Confirmation Emails
                </li>
                <li className={listItemsStyles}>
                    {requirementsMet?.webShopAccess ?
                        <span className='text-[var(--success)] text-[1.25rem] mr-1'>&#x2713;</span>
                        :
                        <span className='text-[var(--company-red)] text-[1.25rem] mr-1'>&#x2717;</span>
                    }
                    Web Shop Access
                </li>
                <li className={listItemsStyles}>
                    {requirementsMet?.apContact ?
                        <span className='text-[var(--success)] text-[1.25rem] mr-1'>&#x2713;</span>
                        :
                        <span className='text-[var(--company-red)] text-[1.25rem] mr-1'>&#x2717;</span>
                    }
                    A/P Contact
                </li>
            </ul>
        </div>
    )
}
