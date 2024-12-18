import { BarLoader } from "react-spinners"

interface Props {
    isSaving: boolean;
    submitHandler: () => void;
}

export default function SaveAndContinueBtns({submitHandler, isSaving} : Props) {
    return (
        <div className="flex justify-between w-[300px] mx-auto mt-8 pb-[100px]">
            <button
                type="button"
                className="custom-small-btn bg-[var(--off-black)] block mx-auto mt-4"
                onClick={submitHandler}
            >
                {isSaving ?
                    <BarLoader
                        color={'white'}
                        width={30}
                        height={2}
                        loading={isSaving}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                        className="mb-1"
                    />
                    :

                    'Save'}
            </button>
            <button
                type="submit"
                className="custom-small-btn bg-[var(--company-red)] block mx-auto mt-4"
            >
                Save and Continue
            </button>
        </div>
    )
}
