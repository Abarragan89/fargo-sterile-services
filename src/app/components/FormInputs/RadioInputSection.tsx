import { GiCheckMark } from "react-icons/gi";

interface Props {
    category: string;
    setCategories: React.Dispatch<React.SetStateAction<string>>;
    toggleSavable?: React.Dispatch<React.SetStateAction<boolean>>;
    radioOptions: { [key: string]: string }[];
    labelText?: string
}

export default function RadioInputSection({ category, setCategories, radioOptions, labelText }: Props) {

    return (
        <fieldset className="w-full">
            {labelText && <label className=" text-[.9rem] block">{labelText}</label>}
            <div className="flex flex-wrap mx-auto bg-white rounded-sm">
                {radioOptions.map(input => {
                    return (
                        <label htmlFor={input.id} className="flex items-center cursor-pointer w-[120px] text-[.9rem] w-fit mr-8 my-2" key={input.id}>
                            <div className="w-[20px] h-[20px] bg-white border border-[var(--gray-500)] rounded-sm relative">
                                {category === input.id ?
                                    <GiCheckMark
                                        className={`absolute top-[1px] left-[2px] scale-125 text-[var(--brown-500)]"`}
                                    />
                                    :
                                    <span>&nbsp;</span>
                                }
                            </div>
                            <input
                                type="radio"
                                id={input.id}
                                name={input.id}
                                checked={category === input.id}
                                hidden
                                onChange={(e) => setCategories(e.target.name)}
                            />
                            <span className="ml-1">{input.label}</span>
                        </label>
                    )
                })}
            </div>
        </fieldset >
    )
}
