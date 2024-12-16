'use client'
import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import InputLabelEl from "../components/FormInputs/InputLabelEl";
import { PDFFile } from "../../../types/pdf";
import RadioInputSection from "../components/FormInputs/RadioInputSection";
import FormBlockHeading from "../components/Headings/FormBlockHeading";
import DropDown from "../components/FormInputs/DropDown";
import TextareaLabel from "../components/FormInputs/TextareaLabel";
import { useRouter } from "next/navigation";
import { accountTypeOptions, facilityTypeOptions } from "../../../data";
import { saveFormData, getFormData } from "../../../utils/indexedDBActions";
import { BarLoader } from "react-spinners";
import ScrollToTop from "../components/ScrollToTop";

export default function Home() {

    const router = useRouter();

    const [pdfFile, setPdfFile] = useState<PDFFile | null>(null);
    const [accountType, setAccountType] = useState<string>('')
    const [accountNumber, setAccountNumber] = useState<string>('')
    const [alternativeSchedule, setAlternativeSchedule] = useState<string>('')
    const [fedExUpsNumber, setFedExUpsNumber] = useState<string>('')
    const [primaryGOPName, setPrimaryGPOName] = useState<string>('')
    const [IDNGroup, setIDNGroup] = useState<string>('');
    const [isSaving, setIsSaving] = useState<boolean>(false)

    const [facilityInformation, setFacilityInformation] = useState({
        facilityname: '',
        phonenumber: '',
        numberofbeds: '',
        facilitytype: '',
    });

    const [facilityAddress, setFacilityAddress] = useState({
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
            if (savedData) {
                setPdfFile(savedData.pdfFile || null);
                setAccountType(savedData.accountType || '');
                setAccountNumber(savedData.accountNumber || '');
                setAlternativeSchedule(savedData.alternativeSchedule || '');
                setFedExUpsNumber(savedData.fedExUpsNumber || '');
                setPdfFile(savedData.pdfFile || '')
                setPrimaryGPOName(savedData.primaryGOPName || '');
                setIDNGroup(savedData.IDNGroup || '');
                setFacilityInformation(savedData.facilityInformation || {
                    facilityname: '',
                    phonenumber: '',
                    numberofbeds: '',
                    facilitytype: '',
                });
                setFacilityAddress(savedData.facilityAddress || {
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
        setFacilityAddress(prev => ({ ...prev, [addressPart]: inputText }))
    }

    function handleFacilityInfoChange(inputText: string, addressPart: string | undefined) {
        if (!addressPart) return;
        setFacilityInformation(prev => ({ ...prev, [addressPart]: inputText }))
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

    async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSaving(true)
        await saveFormData({
            facilityAddress,
            facilityInformation,
            accountType,
            accountNumber,
            fedExUpsNumber,
            alternativeSchedule,
            pdfFile,
            IDNGroup,
            primaryGOPName
        })
        setIsSaving(false)
        router.push('/termsAndConditions', { scroll: true })
    }

    const listItemStyles = 'list-disc text-[.875rem] text-gray-500 py-1'

    return (
        <main className="h-[100vh] max-w-[900px] mx-auto">
            <ScrollToTop />
            <form onSubmit={(e) => handleFormSubmit(e)}>
                {/* Account Type */}
                <FormBlockHeading headingText="Account Information" />
                <div className="flex flex-warp justify-between items-center border-2 border-[var(--company-gray)] rounded-[3px] p-5 mx-5">
                    <RadioInputSection
                        category={accountType}
                        setCategories={setAccountType}
                        radioOptions={accountTypeOptions}
                    />
                    <InputLabelEl
                        labelText="Account # &nbsp;"
                        userText={accountNumber}
                        handleStateChange={setAccountNumber}
                        inline={true}
                    />
                </div>

                {/* Facility Information */}
                <FormBlockHeading headingText="Faculty Information" />
                <div className="flex flex-wrap border-2 border-[var(--company-gray)] rounded-[3px] p-5 mx-5">
                    <div className="flex-1 mr-2">
                        <InputLabelEl
                            labelText="Facility Name"
                            userText={facilityInformation.facilityname}
                            handleStateChange={handleFacilityInfoChange}
                        />
                    </div>
                    <div className="flex-2 mx-2">
                        <InputLabelEl
                            labelText="Phone Number"
                            placeholderText="(555)-555-5555"
                            inputType="tel"
                            userText={facilityInformation.phonenumber}
                            handleStateChange={handleFacilityInfoChange}
                        />
                    </div>
                    <div className="flex-3 w-[125px]">
                        <InputLabelEl
                            labelText="Number of Beds"
                            inputType="number"
                            userText={facilityInformation.numberofbeds}
                            handleStateChange={handleFacilityInfoChange}
                        />
                    </div>

                    {/* Facility Type */}
                    <div className="w-full mt-6">
                        <RadioInputSection
                            radioOptions={facilityTypeOptions}
                            category={facilityInformation.facilitytype}
                            setCategories={handleFacilityInfoChange}
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
                                    userText={facilityAddress.street}
                                    handleStateChange={handleAddressStateChange}
                                />
                            </div>
                            <div className="w-[100px] mr-5">
                                <InputLabelEl
                                    labelText="Suite"
                                    required={false}
                                    userText={facilityAddress.suite}
                                    handleStateChange={handleAddressStateChange}
                                />
                            </div>
                            <div className="w-[100px]">
                                <InputLabelEl
                                    labelText="Attn"
                                    required={false}
                                    userText={facilityAddress.attn}
                                    handleStateChange={handleAddressStateChange}
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap mt-5">
                            <div className="flex-1 mr-5">
                                <InputLabelEl
                                    labelText="City"
                                    userText={facilityAddress.city}
                                    handleStateChange={handleAddressStateChange}
                                />
                            </div>
                            <div className="mx-5">
                                <DropDown
                                    labelText="State"
                                    userChoice={facilityAddress.state}
                                    handleStateChange={handleAddressStateChange}
                                />
                            </div>
                            <div className="">
                                <InputLabelEl
                                    labelText="Zip Code"
                                    pattern="[0-9]{5}"
                                    placeholderText="12345"
                                    userText={facilityAddress.zipcode}
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
                                    required={false}
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
                        {/* GOP and IDN Group */}
                        <div className="flex w-full mt-5">
                            <div className="w-full mr-5">
                                <InputLabelEl
                                    labelText="Primary GPO Name"
                                    userText={primaryGOPName}
                                    handleStateChange={setPrimaryGPOName}
                                />
                            </div>
                            <div className="w-full ml-5">
                                <InputLabelEl
                                    labelText="IDN Group"
                                    userText={IDNGroup}
                                    handleStateChange={setIDNGroup}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Documents */}
                <FormBlockHeading headingText="Documents" />
                <div className=" flex flex-wrap border-2 border-[var(--company-gray)] rounded-[3px] p-5 mx-5">
                    <legend className=" text-[1.05rem] block mb-2">
                        File Uploads
                        <input
                            type="file"
                            accept=".pdf"
                            className="mt-5"
                            onChange={(e) => handleFileChange(e)}
                        />
                    </legend>
                    {/* {pdfFile?.name && <p>{pdfFile.name}</p>} */}
                </div>
                {/* Save and Continue Btn section */}
                <div className="flex justify-between w-[300px] mx-auto mt-8 pb-[100px]">
                    <button
                        type="button"
                        className="custom-small-btn bg-[var(--off-black)] block mx-auto mt-4"
                        onClick={async () => {
                            setIsSaving(true)
                            await saveFormData(
                                {
                                    facilityAddress,
                                    facilityInformation,
                                    accountType,
                                    accountNumber,
                                    fedExUpsNumber,
                                    alternativeSchedule,
                                    pdfFile,
                                    IDNGroup,
                                    primaryGOPName
                                }
                            )
                            setIsSaving(false)
                        }}
                    >
                        {isSaving ?
                            <BarLoader
                                color={'white'}
                                width={30}
                                height={2}
                                loading={isSaving}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                                className="mb-1"
                            />
                            :

                            'Save'}
                    </button>
                    <button
                        type="submit"
                        className="custom-small-btn bg-[var(--company-red)] block mx-auto mt-4"
                    >
                        Save and Continue
                    </button>
                </div>
            </form>

        </main>
    );
}
