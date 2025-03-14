export interface ContactType {
    id: string;
    label: string;
}

export interface ContactInfo {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: ContactType[];
}

export interface StateLicense {
    data: string;
    name: string;
    type: string;
}

export interface TermsAndConditionsInformation {
    date: string;
    fullName: string;
    jobTitle: string;
}

export interface FacilityInformation {
    IDNGroup: string;
    accountNumber: string;
    accountType: string;
    alternativeSchedule: string;
    attn: string;
    city: string;
    facilityName: string;
    facilityType: string;
    fedExUpsNumber: string;
    isRequiringDEA: string;
    numberOfBeds: string;
    phoneNumber: string;
    primaryGPOName: string;
    state: string;
    street: string;
    suite: string;
    zipCode: string;
}

export interface ClinicalDifference {
    facilityAmount: string;
    facilityName: string;
    signature: string;
    signatureDate: string;
    signerName: string;
    signerTitle: string;
}

export interface PaymentMethod {
    paymentMethod: string;
}

export interface IndexedDBData {
    id: number;
    clinicalDifference: ClinicalDifference;
    contactInfo: ContactInfo[];
    deaLicense: string;
    facilityInformation: FacilityInformation;
    letterHead: string;
    otherDocument: string;
    otherFacilities: string[];
    paymentMethod: PaymentMethod;
    salesPersonId: string;
    stateLicense: StateLicense;
    taxExceptionDocs: string;
    taxExceptionDocuments: string;
    termsAndConditionsInformation: TermsAndConditionsInformation;
}
