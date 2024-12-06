interface Props {
    userText: string | number;
    handleStateChange: (textInput: string) => void;
    autofocus?: boolean;
    characterLimit?: number;
    labelText: string;
    inline?: boolean
    inputType?: string;
    placeholderText?: string;
}

export default function InputLabelEl({
    handleStateChange,
    userText,
    autofocus = false,
    characterLimit,
    labelText,
    inline = false,
    inputType = 'text',
    placeholderText
}: Props) {

    return (
        <div className={`${inline ? 'flex items-center' : 'flex flex-col'} mx-auto w-full justify-end`}>
            {labelText &&
                <div
                    className={'flex mx-1'}
                >
                    <label
                        className="text-[.875rem] w-fit"
                        htmlFor={labelText}
                    >{labelText}</label>
                    {characterLimit && (typeof userText === 'string') &&
                        <p className="text-[.85rem]">{userText.length}/{characterLimit}</p>
                    }
                </div>
            }

            <input
                type={inputType}
                id={labelText.toLowerCase().replace(' ', '-')}
                autoFocus={autofocus}
                placeholder={placeholderText}
                maxLength={characterLimit ?? undefined}
                onChange={(e) => handleStateChange(e.target.value)}
                className="input-browser-reset border border-[var(--brown-300)] block px-2 py-[1px]"
            />
        </div>
    )
}
