import { GiCheckMark } from "react-icons/gi";

interface Props {
    category: string;
    // setCategories: React.Dispatch<React.SetStateAction<string>>;
    setCategories: (textInput: string, inputName?: string | undefined) => void;
    radioOptions: { [key: string]: string }[];
    labelText?: string
}

export default function RadioInputSection({ category, setCategories, radioOptions, labelText }: Props) {
    return (
        <fieldset className="w-full">
            {/* {labelText && <legend className="text-[.95rem] block">{labelText}</legend>} */}
            <div className="flex flex-wrap mx-auto bg-white rounded-sm">
                {radioOptions.map(input => {
                    return (
                        <label htmlFor={input.id} className="relative flex cursor-pointer w-[120px] text-[.95rem] w-fit mr-8 my-2" key={input.id}>
                            <div className="min-w-[20px] h-[20px] bg-white border border-gray-500 rounded-sm">
                                {category === input.id ?
                                    <GiCheckMark
                                        className={`absolute top-[2px] left-[3px] scale-125 text-[var(--brown-500)]"`}
                                    />
                                    :
                                    <span>&nbsp;</span>
                                }
                            </div>
                            <input
                                type="radio"
                                required
                                id={input.id}
                                name={input.name}
                                value={input.value}
                                checked={category === input.value}
                                onChange={(e) => setCategories(e.target.name, input.value)}
                                className="opacity-0 relative top-[1px] left-[2px]"
                                aria-label={`Select ${input.label}`}
                                aria-describedby={labelText}
                            />
                            <span className="ml-1">{input.label}</span>
                        </label>
                    )
                })}
            </div>
        </fieldset >
    )
}
