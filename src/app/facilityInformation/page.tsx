'use client'
import { useState, useEffect } from "react";
import InputLabelEl from "../components/FormInputs/InputLabelEl";
import RadioInputSection from "../components/FormInputs/RadioInputSection";
import FormBlockHeading from "../components/Headings/FormBlockHeading";
import DropDown from "../components/FormInputs/DropDown";
import TextareaLabel from "../components/FormInputs/TextareaLabel";
import { useRouter } from "next/navigation";
import { accountTypeOptions, facilityTypeOptions, GPOOptions, yesNoOptions } from "../../../data";
import { saveFormData, getFormData } from "../../../utils/indexedDBActions";
import ScrollToTop from "../components/ScrollToTop";
import SaveAndContinueBtns from "../components/Buttons/SaveAndContinueBtns";
import FormProgressBar from "../components/FormProgressBar";
import { ToastContainer, toast } from 'react-toastify';
import { united_states } from "../../../data";
import { formatPhoneNumber } from "../../../utils/formatPhoneNumber";

export default function Home() {

    const router = useRouter();
    const [isSaving, setIsSaving] = useState<boolean>(false)

    const originalFacilityInfoState = {
        facilityName: '',
        phoneNumber: '',
        numberOfBeds: '',
        facilityType: '',
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

    const [facilityInformation, setFacilityInformation] = useState(originalFacilityInfoState);

    useEffect(() => {
        const fetchData = async () => {
            const savedData = await getFormData(); // Fetch saved data from IndexedDB or any source
            if (savedData) {
                setFacilityInformation(savedData?.facilityInformation || originalFacilityInfoState);
            }
        };
        fetchData();
    }, [])


    function handleFacilityInfoChange(inputName: string, inputValue: string | undefined) {
        // only accept digits for phoneNumbers
        if (inputName === 'phoneNumber' && inputValue) {
            if (inputValue.length >= 15) return
            setFacilityInformation(prev => ({ ...prev, [inputName]: formatPhoneNumber(inputValue) }))
            return
        }
        setFacilityInformation(prev => ({ ...prev, [inputName]: inputValue }))
    }

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setIsSaving(true)
            await saveFormData({
                facilityInformation,
            })
            router.push('/termsAndConditions')
        } catch (error) {
            console.log('error submitting form', error)
        } finally {
            setIsSaving(false)
        }
    }

    async function handleSaveData() {
        try {
            setIsSaving(true)
            await saveFormData({
                facilityInformation,
            })
            notify();
        } catch (error) {
            console.log('error saving data', error)
        } finally {
            setIsSaving(false)
        }
    }

    const notify = () => toast("Data Saved!");
    const listItemStyles = 'list-disc text-[.875rem] text-gray-500 py-1'

    return (
        <main className="h-[100vh] max-w-[900px] mx-auto">
            <ScrollToTop />
            <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <FormProgressBar progress={5} position={1} />

            <form onSubmit={(e) => handleFormSubmit(e)}>
                {/* Account Type */}
                <FormBlockHeading headingText="Account Information" />
                <div className="flex flex-warp justify-between items-center border-2 border-[var(--company-gray)] rounded-[3px] p-5 mx-5">
                    <RadioInputSection
                        category={facilityInformation.accountType}
                        setCategories={handleFacilityInfoChange}
                        radioOptions={accountTypeOptions}
                    />
                    <InputLabelEl
                        labelText="Account #"
                        userText={facilityInformation.accountNumber}
                        nameAndId="accountNumber"
                        handleStateChange={handleFacilityInfoChange}
                        inline={true}
                    />
                </div>

                {/* Facility Information */}
                <FormBlockHeading headingText="Faculty Information" />
                <div className="flex flex-wrap border-2 border-[var(--company-gray)] rounded-[3px] p-5 mx-5">
                    <div className="flex-1 mr-2">
                        <InputLabelEl
                            labelText="Facility Name"
                            userText={facilityInformation.facilityName}
                            handleStateChange={handleFacilityInfoChange}
                            nameAndId='facilityName'
                        />
                    </div>
                    <div className="flex-2 mx-2">
                        <InputLabelEl
                            labelText="Phone Number"
                            placeholderText="(555) 555-5555"
                            title="(555) 555-5555"
                            pattern='^\(\d{3}\) \d{3}-\d{4}$'
                            inputType="tel"
                            nameAndId='phoneNumber'
                            userText={facilityInformation.phoneNumber}
                            handleStateChange={handleFacilityInfoChange}
                        />
                    </div>
                    <div className="flex-3 w-[125px]">
                        <InputLabelEl
                            labelText="Number of Beds"
                            nameAndId='numberOfBeds'
                            inputType="number"
                            userText={facilityInformation.numberOfBeds}
                            handleStateChange={handleFacilityInfoChange}
                        />
                    </div>

                    {/* Facility Type */}
                    <div className="w-full mt-6">
                        <RadioInputSection
                            radioOptions={facilityTypeOptions}
                            category={facilityInformation.facilityType}
                            setCategories={handleFacilityInfoChange}
                            labelText="Facility Type"
                        />
                    </div>
                    {/* Facility Address */}
                    <div className="w-full mt-5">
                        <legend className=" text-[.95rem] block mb-2">
                            Shipping Address &nbsp;
                            <span className="text-[.925rem] text-gray-500 italic underline"
                            >(submitted licenses <span className="font-bold">must</span> match shipping address)</span>
                        </legend>
                        <div className="flex flex-wrap">
                            <div className="flex-1 mr-5">
                                <InputLabelEl
                                    labelText="Street"
                                    userText={facilityInformation.street}
                                    nameAndId='street'
                                    handleStateChange={handleFacilityInfoChange}
                                />
                            </div>
                            <div className="w-[100px] mr-5">
                                <InputLabelEl
                                    labelText="Suite"
                                    required={false}
                                    nameAndId='suite'
                                    userText={facilityInformation.suite}
                                    handleStateChange={handleFacilityInfoChange}
                                />
                            </div>
                            <div className="w-[100px]">
                                <InputLabelEl
                                    labelText="Attn"
                                    nameAndId='attn'
                                    required={false}
                                    userText={facilityInformation.attn}
                                    handleStateChange={handleFacilityInfoChange}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap mt-5">
                            <div className="flex-1 mr-5">
                                <InputLabelEl
                                    labelText="City"
                                    nameAndId='city'
                                    userText={facilityInformation.city}
                                    handleStateChange={handleFacilityInfoChange}
                                />
                            </div>
                            <div className="mx-5">
                                <DropDown
                                    labelText="State"
                                    nameAndId="state"
                                    initialValue="Choose a state..."
                                    isRequired={true}
                                    optionArr={united_states}
                                    userChoice={facilityInformation.state}
                                    handleStateChange={handleFacilityInfoChange}
                                />
                            </div>
                            <div className="">
                                <InputLabelEl
                                    labelText="Zip Code"
                                    pattern="[0-9]{5}"
                                    characterLimit={5}
                                    nameAndId='zipCode'
                                    placeholderText="12345"
                                    userText={facilityInformation.zipCode}
                                    handleStateChange={handleFacilityInfoChange}
                                />
                            </div>
                        </div>

                        {/* Shipping Address Special Directions */}
                        <section className="mt-5">
                            <ul className="pl-4">
                                <li className={listItemStyles}>Shipping charges for expedited shipping will be applied to the order invoice.</li>
                                <li className={listItemStyles}>Standard shipments are scheduled for delivery Monday - Friday.</li>
                                <li className={listItemStyles}>Refrigerated product is only shipped Monday-Wednesday.</li>
                                <li className={listItemStyles}>If alternative delivery schedule is required, please indicate details here:</li>
                                <TextareaLabel
                                    userText={facilityInformation.alternativeSchedule}
                                    handleStateChange={handleFacilityInfoChange}
                                    nameAndId="alternativeSchedule"
                                    characterLimit={350}
                                    required={false}
                                />
                                <li className={listItemStyles}>All orders are shipped via UPS or FedEx.</li>
                                <li className={listItemStyles}>If shipping per customer&apos;s FedEx or UPS account is preferred, enter account number here:</li>
                                <div className="">
                                    <InputLabelEl
                                        userText={facilityInformation.fedExUpsNumber}
                                        handleStateChange={handleFacilityInfoChange}
                                        labelText=""
                                        required={false}
                                        nameAndId='fedExUpsNumber'
                                    />
                                </div>
                            </ul>
                        </section>
                        {/* GOP and IDN Group */}
                        <div className="flex w-full mt-5">
                            <div className="w-full mr-5">
                                <DropDown
                                    labelText="Primary GPO Name"
                                    nameAndId="primaryGPOName"
                                    initialValue="Choose an option..."
                                    optionArr={GPOOptions}
                                    userChoice={facilityInformation.primaryGPOName}
                                    handleStateChange={handleFacilityInfoChange}
                                />
                            </div>
                            <div className="w-full ml-5">
                                <InputLabelEl
                                    labelText="IDN Group"
                                    nameAndId="IDNGroup"
                                    userText={facilityInformation.IDNGroup}
                                    handleStateChange={handleFacilityInfoChange}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Opt into Controlled Substances */}
                    <div className="mt-7">

                        <RadioInputSection
                            radioOptions={yesNoOptions}
                            category={facilityInformation.isRequiringDEA}
                            setCategories={handleFacilityInfoChange}
                            labelText="Will you be ordering controlled substances? If yes, you will need to provide a DEA license."
                        />

                    </div>
                </div>
                {/* Save and Continue Btn section */}
                <SaveAndContinueBtns
                    isSaving={isSaving}
                    submitHandler={handleSaveData}
                />
            </form>

        </main>
    );
}
