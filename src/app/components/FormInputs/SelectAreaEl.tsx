import { useState } from "react";
import { GiCheckMark } from "react-icons/gi";


interface Props {
    blogCategories: { [key: string]: string }[];
    setBlogCategories: React.Dispatch<React.SetStateAction<{ [key: string]: string }[]>>;
    toggleSavable: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SelectAreaEl({ blogCategories, setBlogCategories, toggleSavable }: Props) {

    const checkboxesArr = [
        { id: 'philosophy', label: 'Philosophy' },
        { id: 'religion', label: 'Religion' },
        { id: 'education', label: 'Education' },
        { id: 'technology', label: 'Technology' },
    ];


    function handleSelectionToggle(inputName: string, isChecked: boolean, displayName: string) {
        toggleSavable(true)
        // remove item from array
        if (!isChecked) {
            setBlogCategories(prev => [...prev.filter(name => name.name !== inputName)])
            // add to array
        } else {
            setBlogCategories(prev => [...prev, { name: inputName, displayName }])
        }
    }

    return (
        <fieldset className="w-full">
            <legend className="text-[.95rem] ml-1">Categories</legend>
            <div className="flex justify-between flex-wrap mx-auto bg-white border-2 border-[var(--gray-300)] rounded-md">
                {checkboxesArr.map(input => {
                    return (
                        <label htmlFor={input.id} className="flex items-center cursor-pointer mx-2 my-4 w-[120px] text-[.9rem]" key={input.id}>
                            <div className="w-[20px] h-[20px] bg-white border border-[var(--gray-500)] rounded-[50px] relative">
                                {blogCategories.some((category) => category.name === input.id) ?
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
                                checked={blogCategories.some((category) => category.name === input.id)}
                                hidden
                                onChange={(e) => handleSelectionToggle(e.target.name, e.target.checked, input.label)}
                            />
                            <span className="ml-1">{input.label}</span>
                        </label>
                    )
                })}
            </div>
        </fieldset >
    )
}
