import { useState, useEffect } from "react"
import { Contact } from "../../../types/Contact"

export default function ContactRequirements(
    {
        contactInfo,
        setAllRequirementsMet
    }
        : {
            contactInfo: Contact[]
            setAllRequirementsMet: React.Dispatch<React.SetStateAction<boolean>>
        }
) {

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

        // Create a new state object instead of calling setState multiple times
        const newRequirementsMet = { ...requirementsMetInitialState };

        contactInfo.forEach((contact) => {
            contact.type?.forEach((type) => {
                switch (type.id) {
                    case 'business-contact':
                        newRequirementsMet.businessContact = true;
                        break;
                    case 'invoice-emails':
                        newRequirementsMet.invoiceEmails = true;
                        break;
                    case 'web-shop-access':
                        newRequirementsMet.webShopAccess = true;
                        break;
                    case 'ap-contact':
                        newRequirementsMet.apContact = true;
                        break;
                    case 'order-confirmation-emails':
                        newRequirementsMet.orderConfirmation = true;
                        break;
                }
            });
        });

        // Set state only once to prevent React batching issues
        setRequirementsMet(newRequirementsMet);
        const areRequirementsMet = Object.values(newRequirementsMet).every(value => value === true)
        if (areRequirementsMet && isTwoUniqueEmails) {
            setAllRequirementsMet(true)
            setIsAllContactsProvided(true)
        }

        // Just check if contacts have been provided have been met
        if (areRequirementsMet) {
            setIsAllContactsProvided(true)
        }
    }

    // useEffect to check for requirements
    useEffect(() => {
        if (contactInfo?.length > 0) {
            checkRequirements()
        } else {
            setRequirementsMet(requirementsMetInitialState)
            setIsTwoEmails(false)
            setIsAllContactsProvided(false)
            setAllRequirementsMet(false)
        }
    }, [contactInfo,  ])

    const listItemsStyles = 'ml-7 my-1'

    return (
        <div className="px-6 pb-4 pt-2 mt-10 mx-2 w-[375px]">
            <h3
                className="text-center text-[1.05rem] font-bold text-[var(--company-gray)] mb-2"
            >Requirements</h3>
            <p>
                {isTwoEmails ?
                    <span className='text-[var(--success)] text-[1.25rem] mr-1'>&#x2713;</span>
                    :
                    <span className='text-[var(--company-red)] text-[1.25rem] mr-1'>&#x2717;</span>
                }
                <strong>Two distinct email contacts.</strong>
            </p>
            <p>
                {isAllContactsProvided ?
                    <span className='text-[var(--success)] text-[1.25rem] mr-1'>&#x2713;</span>
                    :
                    <span className='text-[var(--company-red)] text-[1.25rem] mr-1'>&#x2717;</span>
                }
                <strong>One contact identified for each:</strong>
            </p>
            <ul className="grid grid-cols-1 ">
                <li className={`${listItemsStyles} col-span-2`}>
                    {requirementsMet?.businessContact ?
                        <span className='text-[var(--success)] text-[1.25rem] mr-1'>&#x2713;</span>
                        :
                        <span className='text-[var(--company-red)] text-[1.25rem] mr-1'>&#x2717;</span>
                    }
                    Business Contact
                </li>
                <li className={`${listItemsStyles} col-span-2`}>
                    {requirementsMet?.invoiceEmails ?
                        <span className='text-[var(--success)] text-[1.25rem] mr-1'>&#x2713;</span>
                        :
                        <span className='text-[var(--company-red)] text-[1.25rem] mr-1'>&#x2717;</span>
                    }
                    Invoice Emails
                </li>
                <li className={`${listItemsStyles} col-span-2`}>
                    {requirementsMet?.webShopAccess ?
                        <span className='text-[var(--success)] text-[1.25rem] mr-1'>&#x2713;</span>
                        :
                        <span className='text-[var(--company-red)] text-[1.25rem] mr-1'>&#x2717;</span>
                    }
                    Web Shop Access
                </li>
                <li className={`${listItemsStyles} col-span-2`}>
                    {requirementsMet?.apContact ?
                        <span className='text-[var(--success)] text-[1.25rem] mr-1'>&#x2713;</span>
                        :
                        <span className='text-[var(--company-red)] text-[1.25rem] mr-1'>&#x2717;</span>
                    }
                    A/P Contact
                </li>
                <li className={`${listItemsStyles} col-span-3`}>
                    {requirementsMet?.orderConfirmation ?
                        <span className='text-[var(--success)] text-[1.25rem] mr-1'>&#x2713;</span>
                        :
                        <span className='text-[var(--company-red)] text-[1.25rem] mr-1'>&#x2717;</span>
                    }
                    Order Confirmation Emails
                </li>
            </ul>
        </div>
    )
}
