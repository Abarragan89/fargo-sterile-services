'use client';
import { useState, useEffect } from 'react';
import ScrollToTop from '../components/ScrollToTop'
import FormProgressBar from '../components/FormProgressBar';
import { useRouter } from "next/navigation";
import SaveAndContinueBtns from '../components/Buttons/SaveAndContinueBtns';
import { ToastContainer, toast } from 'react-toastify';
import RadioInputSection from '../components/FormInputs/RadioInputSection';
import { clinicalDifferenceRadioOptions } from '../../../data';
import { saveFormData, getFormData } from "../../../utils/indexedDBActions";
import InputLabelEl from '../components/FormInputs/InputLabelEl';
import SelectAreaEl from '../components/FormInputs/SelectAreaEl';
import { SelectItem } from '../../../types/formInputs';

export default function Page() {

    const router = useRouter();
    const [isSaving, setIsSaving] = useState<boolean>(false)

    const originalFormState = {
        facilityAmount: '',
        signerName: '',
        signerTitle: '',
        signatureDate: '',
        signature: ''
    }

    const selectionArr = [{ id: '1', label: 'Check here if you are an HPG group' }]
    const [clinicalDifference, setClinicalDifference] = useState(originalFormState);
    // const [otherFacilities, setOtherFacilities] = useState<{ name: string, value: string }[]>([])
    const [facilityName, setFacilityName] = useState('');
    // const [isHPG, setIsHPG] = useState<boolean>(false);
    const [isHPG, setIsHPG] = useState<SelectItem[]>([])
    const [isMultipleFacilities, setIsMultipleFacilities] = useState<boolean>(false)


    // function handleAddFacility() {
    //     setOtherFacilities(prev => {
    //         const currentLabelName = `facility${prev.length}`
    //         return [
    //             ...prev,
    //             { name: currentLabelName, value: '' }
    //         ]
    //     })
    // }

    // function removeAdditionalFacility(inputName: string) {
    //     setOtherFacilities(prev => ([...prev.filter(inputObj => inputObj.name !== inputName)]))

    // }

    // function handleAddFacilityChange(inputName: string, inputValue: string | undefined) {
    //     setOtherFacilities(prev =>
    //         prev.map(inputObj =>
    //             inputObj.name === inputName
    //                 ? { ...inputObj, value: inputValue as string }
    //                 : inputObj
    //         )
    //     );
    // }

    useEffect(() => {
        const fetchData = async () => {
            const savedData = await getFormData(); // Fetch saved data from IndexedDB or any source
            if (savedData) {
                setClinicalDifference(savedData?.clinicalDifference || originalFormState);
                // setOtherFacilities(savedData?.otherFacilities || [])
                setFacilityName(savedData?.facilityInformation?.facilityName)
                // setIsHPG(savedData?.facilityInformation?.primaryGPOName === 'HPG' ? true : false)
                if (savedData?.facilityInformation?.primaryGPOName === 'HPG') {
                    setIsHPG(prev => [...prev, { id: '1', label: 'hpg' }])
                }
                if (savedData?.clinicalDifference?.facilityAmount === 'multiple-facility') {
                    setIsMultipleFacilities(true)
                }
            }
        };
        fetchData();
    }, [])

    async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            setIsSaving(true)
            await saveFormData({
                clinicalDifference,
                // otherFacilities 
            })
            router.push('/documentUploads')
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
                clinicalDifference,
                // otherFacilities
            })
            notify();
        } catch (error) {
            console.log('error saving data', error)
        } finally {
            setIsSaving(false)
        }
    }



    function handleFacilityInfoChange(inputName: string, inputValue: string | undefined) {
        if (inputName === 'facilityAmount' && inputValue === 'multiple-facility') {
            setIsMultipleFacilities(true)
        } else if (inputName === 'facilityAmount' && inputValue !== 'multiple-facility') {
            setIsMultipleFacilities(false)
        }
        setClinicalDifference(prev => ({ ...prev, [inputName]: inputValue }))
    }

    const notify = () => toast("Data Saved!");

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
            <FormProgressBar progress={59} position={4} />

            <div className='max-w-[700px] w-[93%] mx-auto'>
                {/* Complete PDF */}
                <div className="h-[600px] border-4 border-black">
                    <iframe src={'pdfs/statementOfClinicalDifferenceNoFields.pdf'} width="100%" height="100%" />
                </div>

                <form onSubmit={(e) => handleFormSubmit(e)} className='mx-3'>
                    <p className='text-center py-4 my-4 border-b border-[var(--company-gray)] font-bold'>Please complete and sign below as acknowledgement and confirmation of the applicable statement of clinical difference corresponding to the above preparations.
                    </p>

                    {/*  Input fields */}
                    <div className="my-3">
                        <InputLabelEl
                            userText={facilityName}
                            nameAndId='facilityName'
                            handleStateChange={() => { }}
                            labelText='Facility Name'
                            // required={true}
                            isDisabled={true}
                        />
                    </div>
                    {/* Radio selection for the amount of facilities */}
                    <div className="my-5 relative">
                        <RadioInputSection
                            category={clinicalDifference.facilityAmount}
                            setCategories={handleFacilityInfoChange}
                            radioOptions={clinicalDifferenceRadioOptions}
                        />
                        {isMultipleFacilities && (
                            <p
                                className='text-[var(--company-red)] relative left-10 font-bold mr-5'
                            >
                                You will need to provide a Facility Roster in the Document Upload Section
                            </p>
                        )}
                    </div>
                    {/* Hidden input to add other facilities This is to get ride of */}
                    <div className="my-5">
                        {/* CheckBox to set if  */}
                        <SelectAreaEl
                            totalSelectionOptionsArr={selectionArr}
                            chosenSelectionOptionsArr={isHPG}
                            setChosenSelectionOptionsArr={setIsHPG}
                        />
                    </div>
                    <div className='h-[110px]'>
                        {isHPG.length > 0 ? (
                            <p className='text-[var(--company-red)] relative left-10 font-bold mr-5'>HPG Members will sign the Statement of Clinical Difference in the Web Shop when ordering.</p>
                        ) : (
                            <>
                                <div className="flex justify-between mt-2mb-4">
                                    <div className='w-full mr-2'>
                                        <InputLabelEl
                                            userText={clinicalDifference.signerName}
                                            nameAndId='signerName'
                                            handleStateChange={handleFacilityInfoChange}
                                            labelText='Name'
                                            required={true}
                                        />
                                    </div>
                                    <div className='w-full ml-2'>
                                        <InputLabelEl
                                            userText={clinicalDifference.signerTitle}
                                            nameAndId='signerTitle'
                                            handleStateChange={handleFacilityInfoChange}
                                            labelText='Title'
                                            required={true}
                                        />
                                    </div>
                                </div>
                                <div className='flex mt-6'>
                                    <div className='w-full mr-2'>
                                        <InputLabelEl
                                            userText={clinicalDifference.signerName}
                                            nameAndId='signature'
                                            handleStateChange={handleFacilityInfoChange}
                                            labelText='Signature'
                                            isSignature={true}
                                            isDisabled={true}
                                        />
                                    </div>
                                    <div className='w-full ml-2'>
                                        <InputLabelEl
                                            userText={clinicalDifference.signatureDate}
                                            nameAndId='signatureDate'
                                            handleStateChange={handleFacilityInfoChange}
                                            labelText='Date'
                                            required={true}
                                            inputType='Date'
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    {/* {otherFacilities?.length > 0 &&
                        <div className='mx-auto space-y-3'>
                            <p className='font-bold mb-2'>List additional facilities below:</p>
                            {otherFacilities.map((inputData, index) => (
                                <div key={index} className='flex items-center'>
                                    <InputLabelEl
                                        userText={inputData.value}
                                        nameAndId={inputData.name}
                                        handleStateChange={handleAddFacilityChange}
                                        labelText='Facility Name'
                                        required={true}
                                        inline={true}
                                    />
                                    {index > 0 ? (
                                        <IoMdCloseCircle
                                            onClick={() => removeAdditionalFacility(inputData.name)}
                                            className='inline-block ml-3 text-[1.35rem] text-[var(--company-red)] hover:cursor-pointer hover:text-[var(--off-black)]'
                                        />
                                    ) : (
                                        <IoMdCloseCircle
                                            className='nline-block ml-3 text-[1.4rem] opacity-0'
                                        />
                                    )
                                    }
                                </div>
                            ))}
                            <div className="flex justify-center">
                                <button
                                    type='button'
                                    className='custom-small-btn bg-[var(--off-black)] mt-2 mb-6'
                                    onClick={handleAddFacility}
                                >Add another facility
                                </button>
                            </div>
                        </div>
                    } */}

                    {/* Save and Continue Btn section */}
                    <SaveAndContinueBtns
                        isSaving={isSaving}
                        submitHandler={handleSaveData}
                    />
                </form>
            </div>



        </main>
    )
}