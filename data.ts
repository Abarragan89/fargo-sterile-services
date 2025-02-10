export const accountTypeOptions = [
    { id: 'new-account', name: 'accountType', value: 'new-account', label: 'New Account' },
    { id: 'update', name: 'accountType', value: 'update', label: 'Update' },
];

export const facilityTypeOptions = [
    { id: 'clinic-physician-office', name: 'facilityType', value: 'clinic-physician-office', label: 'Clinic/Physician Office' },
    { id: 'dialysis-clinic', name: 'facilityType', value: 'dialysis-clinic', label: 'Dialysis Clinic' },
    { id: 'hospital', name: 'facilityType', value: 'hospital', label: 'Hospital' },
    { id: 'surgery-center', name: 'facilityType', value: 'surgery-center', label: 'Surgery Center' },
]

export const clinicalDifferenceRadioOptions = [
    { id: 'one-facility', name: 'facilityAmount', value: 'one-facility', label: 'I am signing this statement of clinical difference on behalf of one facility, listed below.' },
    { id: 'multiple-facility', name: 'facilityAmount', value: 'multiple-facility', label: 'I am signing this statement of clinical difference on behalf of multiple facilities, please reference attached list for facilities this statement of clinical differences covers. (List of facilities must be attached.)' }
]
