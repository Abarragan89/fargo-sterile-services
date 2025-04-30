export const accountTypeOptions = [
    { id: 'new-account', name: 'accountType', value: 'new-account', label: 'New Account' },
    { id: 'update', name: 'accountType', value: 'update', label: 'Update' },
];

export const facilityTypeOptions = [
    { id: 'clinic-physician-office', name: 'facilityType', value: 'Clinic/Physician Office', label: 'Clinic/Physician Office' },
    { id: 'dialysis-clinic', name: 'facilityType', value: 'Dialysis Clinic', label: 'Dialysis Clinic' },
    { id: 'hospital', name: 'facilityType', value: 'Hospital', label: 'Hospital' },
    { id: 'surgery-center', name: 'facilityType', value: 'Surgery Center', label: 'Surgery Center' },
    { id: 'EMS', name: 'facilityType', value: 'EMS', label: 'EMS' },
]

export const clinicalDifferenceRadioOptions = [
    { id: 'one-facility', name: 'facilityAmount', value: 'one-facility', label: 'I am signing this statement of clinical difference on behalf of one facility, listed above.' },
    { id: 'multiple-facility', name: 'facilityAmount', value: 'multiple-facility', label: 'I am signing this statement of clinical difference on behalf of multiple facilities.' }
]
export const yesNoOptions = [
    { id: 'Yes', name: 'isRequiringDEA', value: 'Yes', label: 'Yes' },
    { id: 'No', name: 'isRequiringDEA', value: 'No', label: 'No' }
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


// export const united_states = [
//     "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
//     "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
//     "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
//     "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
//     "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
//     "New Hampshire", "New Jersey", "New Mexico", "New York",
//     "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
//     "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
//     "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
//     "West Virginia", "Wisconsin", "Wyoming"
// ];

export const united_states = [
    "AL", "AK", "AZ", "AR", "CA", "CO",
    "CT", "DE", "FL", "GA", "HI", "ID",
    "IL", "IN", "IA", "KS", "KY", "LA",
    "ME", "MD", "MA", "MI", "MN",
    "MS", "MO", "MT", "NE", "NV",
    "NH", "NJ", "NM", "NY",
    "NC", "ND", "OH", "OK", "OR",
    "PA", "RI", "SC", "SD",
    "TN", "TX", "UT", "VT", "VA", "WA",
    "WV", "WI", "WY"
];



export const GPOOptions = [
    "HPG", "Premier", "Advantus", "EyePro", "Cardinal Acuity",
    "The Resource Group", "Intalere", "KP-T3", "MNS", "NY-Pres",
    "PDM", "Sutter", "TJUH", "UMMS", "UPMC", "VHPC"
];


export const salesPersonDirectory = {
    'null': {
        name: 'Justin Feagin',
        email: 'justin.feagin@fagronsterile.com'
    },
    '75610': {
        name: 'Ben Diles',
        email: 'ben.diles@fagronsterile.com'
    },
    '10973': {
        name: 'Shane McCarney',
        email: 'shane.mccarney@fagronsterile.com'
    },
    '43892': {
        name: 'Justin Feagin',
        email: 'justin.feagin@fagronsterile.com'
    },
    '87462': {
        name: 'Rocky Brown',
        email: 'rocky.brown@fagronsterile.com'
    }
}


