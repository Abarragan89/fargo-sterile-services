import { BarLoader } from "react-spinners";

interface Props {
    isLoading: boolean;
    isSubmittable: boolean;
    children: React.ReactNode;
    value?: string;
    color?: string
}

export default function SubmitButton({ isLoading, isSubmittable, children, value, color }: Props) {

    return (
        <button
            type="submit"
            value={value ?? value}
            className={`custom-small-btn
                ${color === 'green' ? 'bg-[var(--success)]' : color === 'red' ? 'bg-[var(--company-red)]' : 'bg-[var(--off-black)]'} 
                h-[30px] 
                ${isSubmittable ? '' : 'opacity-[.5] pointer-events-none'}`}
        >
            {isLoading ?
                <BarLoader
                    color={'white'}
                    width={30}
                    height={2}
                    loading={isLoading}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    className="mb-1"
                />
                :
                children
            }
        </button>
    )
}
