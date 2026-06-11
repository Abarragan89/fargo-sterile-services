import { useEffect, useState } from 'react'
import { getFormData } from '../../../utils/indexedDBActions';
import { Contact } from '../../../types/Contact';

export default function UseFormData() {

  const originalFacilityInfoState = {
    facilityName: '',
    phoneNumber: '',
    numberOfBeds: '',
    facilityType: '',
    is501c3: '',
    accountType: '',
    primaryGPOName: '',
    fedExUpsNumber: '',
    accountNumber: '',
    IDNGroup: '',
    street: '',
    suite: '',
    attn: '',
    city: '',
    state: '',
    zipCode: '',
    alternativeSchedule: '',
    isRequiringDEA: ''
  }

  const originalTermsAndConditions = {
    fullName: '',
    jobTitle: '',
    date: ''
  }
  const paymentMethodInitialState = {
    paymentMethod: '',
  }
  const contactInfoInitialState: Contact[] = []
  const [isLoading, setIsLoading] = useState(true)
  const [facilityInformation, setFacilityInformation] = useState(originalFacilityInfoState);
  const [termsAndConditionsInformation, setTermsAndConditionInformation] = useState(originalTermsAndConditions)
  const [paymentMethod, setPaymentMethod] = useState(paymentMethodInitialState)
  const [contactInfo, setContactInfo] = useState(contactInfoInitialState)

  useEffect(() => {
    const fetchData = async () => {
      const savedData = await getFormData(); // Fetch saved data from IndexedDB or any source
      if (savedData) {
        setFacilityInformation(savedData?.facilityInformation || originalFacilityInfoState);
        setTermsAndConditionInformation(savedData?.termsAndConditionsInformation || originalTermsAndConditions);
        setPaymentMethod(savedData?.paymentMethod || paymentMethodInitialState);
        setContactInfo(savedData?.contactInfo || contactInfoInitialState)
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);


  return {
    facilityInformation,
    setFacilityInformation,
    termsAndConditionsInformation,
    setTermsAndConditionInformation,
    paymentMethod,
    setPaymentMethod,
    contactInfo,
    setContactInfo,
    isLoading
  };
}
