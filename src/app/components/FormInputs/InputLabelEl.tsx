interface Props {
    userText: string | number;
    handleStateChange: (textInput: string, inputName?: string | undefined) => void;
    autofocus?: boolean;
    characterLimit?: number;
    labelText: string;
    inline?: boolean
    inputType?: string;
    placeholderText?: string;
    required?: boolean
    pattern?:string
}

export default function InputLabelEl({
    handleStateChange,
    userText,
    autofocus = false,
    characterLimit,
    labelText,
    inline = false,
    inputType = 'text',
    placeholderText,
    required = true,
    pattern
}: Props) {

    return (
        <div className={`${inline ? 'flex items-center' : 'flex flex-col'} mx-auto w-full justify-end`}>
            {labelText &&
                <div
                    className={'flex'}
                >
                    <label
                        className="text-[.95rem] w-fit"
                        htmlFor={labelText}
                    >{labelText}</label>
                    {characterLimit && (typeof userText === 'string') &&
                        <p className="text-[.85rem]">{userText.length}/{characterLimit}</p>
                    }
                </div>
            }

            <input
                type={inputType}
                id={labelText.toLowerCase().replace(' ', '')}
                required={required}
                value={userText}
                autoFocus={autofocus}
                placeholder={placeholderText}
                maxLength={characterLimit ?? undefined}
                pattern={pattern ?? undefined}
                onChange={(e) => handleStateChange(e.target.value, e.target.id)}
                className="input-browser-reset border border-[var(--brown-300)] block px-2 py-[1px]"
            />
        </div>
    )
}
