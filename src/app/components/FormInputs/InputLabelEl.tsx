import { cursiveFont } from "@/app/font";

interface Props {
    userText: string | number;
    nameAndId: string
    // This is either set state or a handler to handler to handle a state object
    handleStateChange: (textInput: string, inputName?: string | undefined) => void;
    autofocus?: boolean;
    characterLimit?: number;
    labelText: string;
    inline?: boolean
    inputType?: string;
    placeholderText?: string;
    autocomplete?: boolean;
    required?: boolean;
    pattern?: string;
    isSignature?: boolean;
    isDisabled?: boolean;
    title?: string;
}

export default function InputLabelEl({
    handleStateChange,
    userText,
    nameAndId,
    autofocus = false,
    characterLimit,
    labelText,
    inline = false,
    inputType = 'text',
    placeholderText,
    required = true,
    pattern,
    autocomplete = true,
    isSignature = false,
    isDisabled = false,
    title
}: Props) {

    return (
        <div className={`grid ${inline ? 'grid-cols-[auto,1fr] items-center' : 'grid-cols-1'} mx-auto w-full`}>
            {labelText && (
                <>
                    <label
                        className="text-[.95rem] mr-1 relative"
                        htmlFor={nameAndId}
                    >
                        {labelText} {required ? <span className="text-[var(--company-red)] top-[-3px] absolute text-[1.3rem]">*</span> : ''}
                    </label>

                    {characterLimit && typeof userText === 'string' && (
                        <p className="text-[.85rem] text-right">{userText?.length}/{characterLimit}</p>
                    )}
                </>
            )}

            <input
                type={inputType}
                id={nameAndId}
                name={nameAndId}
                title={title ?? undefined}
                required={required}
                disabled={isDisabled}
                value={userText}
                autoFocus={autofocus}
                autoComplete={autocomplete ? 'on' : 'off'}
                placeholder={placeholderText}
                maxLength={characterLimit ?? undefined}
                pattern={pattern ?? undefined}
                onChange={(e) => handleStateChange(nameAndId, e.target.value)}
                className={
                    `${isSignature ?
                        `${cursiveFont.className} text-[1.2rem] py-0 my-0 border-b border-gray-500 rounded-none`
                        :
                        'border border-gray-500 block py-[1px]'
                    } 
                        ${inline ? 'ml-2' : ''}
                        ${isDisabled ? 'hover:cursor-not-allowed bg-gray-200' : ''}
                    input-browser-reset px-2 w-full`
                }
            />
        </div>
    );
}
