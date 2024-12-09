
interface Props {
    userChoice: string | number;
    handleStateChange: (textInput: string, inputName?: string | undefined) => void;
    labelText: string;
}

export default function DropDown({ userChoice, handleStateChange, labelText }: Props) {
    const states = [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
        "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
        "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
        "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
        "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
        "New Hampshire", "New Jersey", "New Mexico", "New York",
        "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
        "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
        "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
        "West Virginia", "Wisconsin", "Wyoming"
    ];

    return (
        <>
            <label htmlFor="states" className="text-[.95rem] block mt-3">
                {labelText}
            </label>
            <select
                id="state"
                name="state"
                required
                value={userChoice}
                onChange={(e) => handleStateChange(e.target.value, e.target.id)}
                className="border border-[var(--company-gray)] text-[.95rem] rounded-sm py-[3px] px-2"
            >
                <option value="" disabled>
                    Choose a state...
                </option>
                {states.map((state) => (
                    <option
                        key={state} value={state}>
                        {state}
                    </option>
                ))}
            </select>
        </>
    )
}
