'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import InputLabelEl from "../components/FormInputs/InputLabelEl";
import { PDFFile } from "../../../types/pdf";
import RadioInputSection from "../components/FormInputs/RadioInputSection";
import FormBlockHeading from "../components/Headings/FormBlockHeading";
import DropDown from "../components/FormInputs/DropDown";
import TextareaLabel from "../components/FormInputs/TextareaLabel";
import { accountTypeOptions, facilityTypeOptions } from "../../../data";
import { saveFormData, getFormData } from "../../../utils/indexedDBActions";

export default function Home() {


    const [firstName, setFirstName] = useState<string>('');
    const [pdfFile, setPdfFile] = useState<PDFFile | null>(null);
    const [accountType, setAccountType] = useState<string>('')
    const [facilityType, setFacilityType] = useState<string>('')
    const [facilityName, setFacilityName] = useState<string>('')
    const [facilityPhoneNumber, setFacilityPhoneNumber] = useState<string>('')
    const [numberOfBeds, setNumberOfBeds] = useState<string>('')
    const [alternativeSchedule, setAlternativeSchedule] = useState<string>('')
    const [fedExUpsNumber, setFedExUpsNumber] = useState<string>('')
    const [address, setAddress] = useState({
        street: '',
        suite: '',
        attn: '',
        city: '',
        state: '',
        zipcode: '',
    });



    useEffect(() => {
        const fetchData = async () => {
            const savedData = await getFormData(); // Fetch saved data from IndexedDB or any source
            console.log('saved data ', savedData)
            if (savedData) {
                console.log('in here', savedData.facilityName)
                setFirstName(savedData.firstName || '');
                setPdfFile(savedData.pdfFile || null);
                setAccountType(savedData.accountType || '');
                setFacilityType(savedData.facilityType || '');
                setFacilityName(savedData.facilityName || '');
                setFacilityPhoneNumber(savedData.facilityPhoneNumber || '');
                setNumberOfBeds(savedData.numberOfBeds || '');
                setAlternativeSchedule(savedData.alternativeSchedule || '');
                setFedExUpsNumber(savedData.fedExUpsNumber || '');
                setAddress(savedData.address || {
                    street: '',
                    suite: '',
                    attn: '',
                    city: '',
                    state: '',
                    zipcode: '',
                });
            }
        };
        fetchData();
    }, [])

    function handleAddressStateChange(inputText: string, addressPart: string | undefined) {
        if (!addressPart) return;
        setAddress(prev => ({ ...prev, [addressPart]: inputText }))
    }

    async function sendMail() {
        try {
            await axios.post('/api/sendEmail', {
                pdfData: JSON.stringify({ pdfFile }),
                firstName: firstName
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        } catch (error) {
            console.log('errror ', error)
        }
    }


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            throw new Error('add a file')
        }

        const file = event.target.files[0];
        if (!file) {
            return
        }
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                // @ts-expect-error: error getting 
                const fileData = event.target.result.split(',')[1];
                setPdfFile({
                    name: file.name,
                    type: file.type,
                    data: fileData,
                });
            };
            reader.readAsDataURL(file);
        }
    };



    const listItemStyles = 'list-disc text-[.875rem] text-gray-500 py-1'

    console.log(facilityName)

    return (
        <main className="h-[100vh] max-w-[900px] mx-auto">
            <form>
                {/* Account Type */}
                <FormBlockHeading headingText="Account Information" />
                <div className="flex justify-between items-center border-2 border-[var(--company-gray)] rounded-[3px] p-5 mx-5">
                    <RadioInputSection
                        category={accountType}
                        setCategories={setAccountType}
                        radioOptions={accountTypeOptions}
                    />

                    <InputLabelEl
                        labelText="Account # &nbsp;"
                        userText={firstName}
                        handleStateChange={setFirstName}
                        inline={true}
                    />
                </div>

                {/* Facility Information */}
                <FormBlockHeading headingText="Faculty Information" />
                <div className="flex flex-wrap border-2 border-[var(--company-gray)] rounded-[3px] p-5 mx-5">
                    <div className="flex-1 mr-2">
                        <InputLabelEl
                            labelText="Facility Name"
                            userText={facilityName}
                            handleStateChange={setFacilityName}
                        />
                    </div>
                    <div className="flex-2 mx-2">
                        <InputLabelEl
                            labelText="Phone Number"
                            placeholderText="(555)-555-5555"
                            inputType="tel"
                            userText={facilityPhoneNumber}
                            handleStateChange={setFacilityPhoneNumber}
                        />
                    </div>
                    <div className="flex-3 w-[125px]">
                        <InputLabelEl
                            labelText="Number of Beds"
                            inputType="number"
                            userText={numberOfBeds}
                            handleStateChange={setNumberOfBeds}
                        />
                    </div>

                    {/* Facility Type */}
                    <div className="w-full mt-6">
                        <RadioInputSection
                            radioOptions={facilityTypeOptions}
                            category={facilityType}
                            setCategories={setFacilityType}
                            labelText="Facility Type"
                        />
                    </div>
                    {/* Facility Address */}
                    <div className="w-full mt-5">
                        <legend className=" text-[.95rem] block mb-2">
                            Shipping Address
                            <span className="text-[.925rem] text-gray-500 italic"
                            > (submitted licenses <span className="font-bold">must</span> match shipping address)</span>
                        </legend>
                        <div className="flex flex-wrap">
                            <div className="flex-1 mr-5">
                                <InputLabelEl
                                    labelText="Street"
                                    userText={address.street}
                                    handleStateChange={handleAddressStateChange}
                                />
                            </div>
                            <div className="w-[100px] mr-5">
                                <InputLabelEl
                                    labelText="Suite"
                                    required={false}
                                    userText={address.suite}
                                    handleStateChange={handleAddressStateChange}
                                />
                            </div>
                            <div className="w-[100px]">
                                <InputLabelEl
                                    labelText="Attn"
                                    required={false}
                                    userText={address.attn}
                                    handleStateChange={handleAddressStateChange}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap mt-5">
                            <div className="flex-1 mr-5">
                                <InputLabelEl
                                    labelText="City"
                                    userText={address.city}
                                    handleStateChange={handleAddressStateChange}
                                />
                            </div>
                            <div className="ml-5">
                                <DropDown
                                    labelText="State"
                                    userChoice={address.state}
                                    handleStateChange={handleAddressStateChange}
                                />
                            </div>
                            <div className="ml-5">
                                <InputLabelEl
                                    labelText="Zip Code"
                                    pattern="[0-9]{5}"
                                    placeholderText="12345"
                                    userText={address.zipcode}
                                    handleStateChange={handleAddressStateChange}
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
                                    userText={alternativeSchedule}
                                    handleStateChange={setAlternativeSchedule}
                                />
                                <li className={listItemStyles}>All orders are shipped via UPS or FedEx.</li>
                                <li className={listItemStyles}>If shipping per customer&apos;s FedEx or UPS account is preferred, enter account number here:</li>
                                <div className="">
                                    <InputLabelEl
                                        userText={fedExUpsNumber}
                                        handleStateChange={setFedExUpsNumber}
                                        labelText=""
                                        required={false}
                                    />
                                </div>
                            </ul>
                        </section>
                    </div>
                </div>

                {/* <button type="submit">Submit</button> */}
            </form>

            <FormBlockHeading headingText="Documents" />
            <div className="border-2 border-[var(--company-gray)] rounded-[3px] p-5 mx-5">
                <h3 className="text-[1.2rem]">File Uploads</h3>
                <input
                    type="file"
                    accept=".pdf"
                    className="mt-5"
                    onChange={(e) => handleFileChange(e)}
                />
            </div>

            {/* Save and Continue Btn section */}
            <div className="flex justify-between w-[300px] mx-auto mt-8 pb-[100px]">
                <button
                    className="custom-small-btn bg-[var(--company-gray)] block mx-auto mt-4"
                    onClick={() => saveFormData({ address, facilityName, facilityPhoneNumber, facilityType })}
                >
                    Save
                </button>
                <button
                    className="custom-small-btn bg-[var(--company-red)] block mx-auto mt-4"
                    onClick={sendMail}
                >
                    Save and Continue
                </button>
            </div>
        </main>
    );
}
