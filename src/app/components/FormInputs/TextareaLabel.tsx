interface Props {
    userText: string;
    nameAndId: string
    handleStateChange: (textInput: string, inputName?: string | undefined) => void;
    autofocus?: boolean;
    characterLimit?: number;
    labelText?: string;
    placeholderText?: string;
    required?: boolean
}

export default function TextareaLabel({ handleStateChange, userText, autofocus = false, characterLimit, labelText, placeholderText, required = true, nameAndId }: Props) {
    return (
        <div className="flex flex-col mx-auto w-full">
            <div className={`flex mx-1 ${labelText ? 'justify-between' : 'justify-end'}`}>
                {labelText &&
                    <label
                        className="text-[.875rem]"
                        htmlFor={labelText}
                    >{labelText}</label>
                }
                {characterLimit &&
                    <p className="text-[.85rem] text-[var(--gray-600)]">{userText?.length}/{characterLimit}</p>
                }
            </div>

            <textarea
                id={nameAndId}
                name={nameAndId}
                autoFocus={autofocus}
                maxLength={characterLimit ?? undefined}
                placeholder={placeholderText ?? placeholderText}
                value={userText}
                required={required}
                onChange={(e) => handleStateChange(nameAndId, e.target.value)}
                className="input-browser-reset border text-[.95rem] border-[var(--company-gray)] block p-2 w-full"
                rows={3}
                cols={30}
            />
        </div>
    )
}