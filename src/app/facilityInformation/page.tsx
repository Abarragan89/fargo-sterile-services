'use client'
import { useState } from "react";
import axios from "axios";
import InputLabelEl from "../components/FormInputs/InputLabelEl";
import { PDFFile } from "../../../types/pdf";
import RadioInputSection from "../components/FormInputs/RadioInputSection";

export default function Home() {

    const [firstName, setFirstName] = useState<string>('');
    const [pdfFile, setPdfFile] = useState<PDFFile | null>(null);
    const [accountType, setAccountType] = useState<string>('')
    const [facilityType, setFacilityType] = useState<string>('')
    const [facilityName, setFacilityName] = useState<string>('')
    const [facilityPhoneNumber, setFacilityPhoneNumber] = useState<string>('')
    const [numberOfBeds, setNumberOfBeds] = useState<string>('')

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

    const accountTypeOptions = [
        { id: 'new-account', label: 'New Account' },
        { id: 'update', label: 'Update' },
    ];

    const facilityTypeOptions = [
        { id: 'clinic-physician-office', label: 'Clinic/Physician Office' },
        { id: 'dialysis-clinic', label: 'Dialysis Clinis' },
        { id: 'hospital', label: 'Hospital' },
        { id: 'surgery-center', label: 'Surgery Center' },
    ]


    return (
        <main className="h-[100vh] max-w-[900px] mx-auto">
            {/* Account Type */}
            <h1 className="mt-7 text-center text-center text-[1.25rem] mb-2 tracking-wider font-bold text-[var(--company-gray)]">Account Information</h1>
            <div className="flex justify-between items-center border-2 border-[var(--company-gray)] rounded-[3px] p-5 mx-5">
                <RadioInputSection
                    category={accountType}
                    setCategories={setAccountType}
                    radioOptions={accountTypeOptions}
                />

                <InputLabelEl
                    labelText="Account Number"
                    userText={firstName}
                    handleStateChange={setFirstName}
                    inline={true}
                />
            </div>

            {/* Facility Information */}
            <h1 className="mt-10 text-center text-center text-[1.25rem] mb-2 tracking-wider font-bold text-[var(--company-gray)]">Facility Information</h1>
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
                <div className="flex-3 w-[115px]">
                    <InputLabelEl
                        labelText="Number of Beds"
                        inputType="number"
                        userText={numberOfBeds}
                        handleStateChange={setNumberOfBeds}
                    />
                </div>

                {/* Facility Type */}
                <div className="mx-2 w-full mt-5">
                    <RadioInputSection
                        radioOptions={facilityTypeOptions}
                        category={facilityType}
                        setCategories={setFacilityType}
                        labelText="Facility Type"
                        
                    />
                </div>
            </div>

            



            <h1 className="mt-10 text-center text-center text-[1.25rem] mb-2 tracking-wider font-bold text-[var(--company-gray)]">Documents</h1>
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
            <div className="flex justify-between w-[300px] mx-auto mt-8">
                <button
                    className="custom-small-btn bg-[var(--company-gray)] block mx-auto mt-4"
                    onClick={sendMail}
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
