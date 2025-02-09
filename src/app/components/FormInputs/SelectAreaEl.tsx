// import { useState } from "react";
import { GiCheckMark } from "react-icons/gi";
import { SelectItem } from "../../../../types/formInputs";

interface Props {
    chosenSelectionOptionsArr: SelectItem[];
    setChosenSelectionOptionsArr: React.Dispatch<React.SetStateAction<SelectItem[]>>;
    toggleSavable?: React.Dispatch<React.SetStateAction<boolean>>;
    totalSelectionOptionsArr: SelectItem[]
}


export default function SelectAreaEl({ chosenSelectionOptionsArr, setChosenSelectionOptionsArr, totalSelectionOptionsArr }: Props) {

    function handleSelectionToggle(inputId: string, isChecked: boolean, label: string) {
        // remove item from array
        if (!isChecked) {
            setChosenSelectionOptionsArr(prev => [...prev.filter(option => option.id !== inputId)])
            // add to array
        } else {
            setChosenSelectionOptionsArr(prev => [...prev, { id: inputId, label }])
        }
    }

    return (
        <fieldset className="w-full">
            <div className="flex justify-between flex-wrap mx-auto">
                {totalSelectionOptionsArr.map((input: SelectItem) => {
                    return (
                        <label htmlFor={input.id} className="flex items-center cursor-pointer my-4 w-full text-[.9rem]" key={input.id}>
                            <div className="w-[20px] h-[20px] bg-white border border-gray-500 rounded-sm relative">
                                {chosenSelectionOptionsArr.some((category) => category.id === input.id) ?
                                    <GiCheckMark
                                        className={`absolute top-[1px] left-[2px] scale-125 text-[var(--brown-500)]"`}
                                    />
                                    :
                                    <span>&nbsp;</span>
                                }
                            </div>
                            <input
                                type="checkbox"
                                id={input.id}
                                name={input.id}
                                checked={chosenSelectionOptionsArr.some((category) => category.id === input.id)}
                                hidden
                                onChange={(e) => handleSelectionToggle(e.target.id, e.target.checked, input.label)}
                            />
                            <span className="ml-2 text-[.9rem]">{input.label}</span>
                        </label>
                    )
                })}
            </div>
        </fieldset >
    )
}
