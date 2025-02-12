export const accountTypeOptions = [
    { id: 'new-account', name: 'accountType', value: 'new-account', label: 'New Account' },
    { id: 'update', name: 'accountType', value: 'update', label: 'Update' },
];

export const facilityTypeOptions = [
    { id: 'clinic-physician-office', name: 'facilityType', value: 'clinic-physician-office', label: 'Clinic/Physician Office' },
    { id: 'dialysis-clinic', name: 'facilityType', value: 'dialysis-clinic', label: 'Dialysis Clinic' },
    { id: 'hospital', name: 'facilityType', value: 'hospital', label: 'Hospital' },
    { id: 'surgery-center', name: 'facilityType', value: 'surgery-center', label: 'Surgery Center' },
    { id: 'EMS', name: 'facilityType', value: 'EMS', label: 'EMS' },
]

export const clinicalDifferenceRadioOptions = [
    { id: 'one-facility', name: 'facilityAmount', value: 'one-facility', label: 'I am signing this statement of clinical difference on behalf of one facility, listed below.' },
    { id: 'multiple-facility', name: 'facilityAmount', value: 'multiple-facility', label: 'I am signing this statement of clinical difference on behalf of multiple facilities, please reference attached list for facilities this statement of clinical differences covers. (List of facilities must be attached.)' }
]

export const paymentOptions = [
    { id: 'check', name: 'paymentMethod', value: 'check', label: 'Check - Mail to: PO Box: Dept CH 18048, Palatine, IL 60055-8048' },
    { id: 'ach', name: 'paymentMethod', value: 'ach', label: 'ACH - Email remittance to: ar@fagronsterile.com' },
    { id: 'echeck', name: 'paymentMethod', value: 'echeck', label: 'eCheck - Scan and email to: ar@fagronsterile.com' }
]


export const contactTypeOptions = [
    { id: 'business-contact', name: 'business-contact', value: 'business-contact', label: 'Business Contact' },
    { id: 'invoice-emails', name: 'invoice-emails', value: 'invoice-emails', label: 'Invoice Emails' },
    { id: 'web-shop-access', name: 'web-shop-access', value: 'web-shop-access', label: 'Web Shop Access' },
    { id: 'ap-contact', name: 'ap-contact', value: 'ap-contact', label: 'A/P Contact' },
    { id: 'order-confirmation-emails', name: 'order-confirmation-emails', value: 'order-confirmation-emails', label: 'Order Confirmation Emails' },
];