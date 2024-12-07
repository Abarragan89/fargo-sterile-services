export default function FormBlockHeading({ headingText }: { headingText: string }) {

    return (
        <h2 className="mt-7 text-center text-center text-[1.25rem] mb-2 tracking-wider font-bold text-[var(--company-gray)]">{headingText}</h2>
    )
}
