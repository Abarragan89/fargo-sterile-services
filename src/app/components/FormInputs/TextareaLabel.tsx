interface Props {
    userText: string;
    handleStateChange: (textInput: string) => void;
    autofocus?: boolean;
    characterLimit?: number;
    labelText?: string;
    placeholderText?: string;
    required?: boolean
}

export default function TextareaLabel({ handleStateChange, userText, autofocus = false, characterLimit, labelText, placeholderText, required = true }: Props) {
    return (
        <div className="flex flex-col w-fit mx-auto mt-2 w-full">
            <div className={`flex mx-1 ${labelText ? 'justify-between' : 'justify-end'}`}>
                {labelText &&
                    <label
                        className="text-[.875rem]"
                        htmlFor={labelText}
                    >{labelText}</label>
                }
                {characterLimit &&
                    <p className="text-[.85rem] text-[var(--gray-600)]">{userText.length}/{characterLimit}</p>
                }
            </div>

            <textarea
                id={labelText}
                autoFocus={autofocus}
                maxLength={characterLimit ?? undefined}
                placeholder={placeholderText ?? placeholderText}
                value={userText}
                required={required}
                onChange={(e) => handleStateChange(e.target.value)}
                className="input-browser-reset border text-[.95rem] border-[var(--company-gray)] block p-2 w-full"
                rows={3}
                cols={30}
            />
        </div>
    )
}