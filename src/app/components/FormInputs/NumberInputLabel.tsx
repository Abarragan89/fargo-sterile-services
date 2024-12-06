interface Props {
    userText: string;
    handleStateChange: (textInput: string) => void;
    autofocus?: boolean;
    characterLimit?: number;
    labelText: string;
}

export default function NumberInputLabelEl({ handleStateChange, userText, autofocus = false, characterLimit, labelText }: Props) {
    return (
        <div className="flex flex-col w-fit mx-auto w-full">

            {labelText &&
                <div className="flex justify-between mx-1">
                    <label
                        className="text-[.875rem]"
                        htmlFor={labelText}
                    >{labelText}</label>
                    {characterLimit &&
                        <p className="text-[.85rem]">{userText.length}/{characterLimit}</p>
                    }
                </div>
            }

            <input
                type='number'
                id={labelText}
                autoFocus={autofocus}
                maxLength={characterLimit ?? undefined}
                onChange={(e) => handleStateChange(e.target.value)}
                className="input-browser-reset border border-[var(--brown-300)] mx-auto block px-2 py-[1px] w-full"
            />
        </div>
    )
}
