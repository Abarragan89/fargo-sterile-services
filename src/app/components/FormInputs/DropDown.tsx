
interface Props {
    userChoice: string | number;
    handleStateChange: (textInput: string, inputName?: string | undefined) => void;
    labelText: string;
    nameAndId: string;
    optionArr: string[];
    isRequired?: boolean;
    initialValue: string
}

export default function DropDown({ userChoice, handleStateChange, labelText, nameAndId, optionArr, isRequired = true, initialValue }: Props) {

    return (
        <>
            <label htmlFor="states" className="text-[.95rem] block relative">
                {labelText}<span className="text-[var(--company-red)] top-[-3px] absolute text-[1.3rem]">*</span>
            </label>
            <select
                id={nameAndId}
                name={nameAndId}
                required={isRequired}
                value={userChoice}
                onChange={(e) => handleStateChange(nameAndId, e.target.value)}
                className="input-browser-reset border border-[var(--company-gray)] text-[.95rem] rounded-sm py-[3px] px-2 w-full"
            >
                <option value="" disabled>
                    {initialValue}
                </option>
                {optionArr.map((option) => (
                    <option
                        key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </>
    )
}
