import { Line } from 'rc-progress';
import Link from 'next/link';

export default function FormProgressBar({ progress, position }: { progress: number, position: number }) {

    const labels = [
        { text: "Facility Information", href: "/facilityInformation" },
        { text: "Terms & Conditions", href: "/termsAndConditions" },
        { text: "Payment & Contacts", href: "/paymentAndContacts" },
        { text: "Credit Application", href: "/creditApplication" },
        { text: "Document Uploads", href: "/documentUploads" },
        { text: "Review Information", href: "/reviewInformation" },
    ];

    function renderLabels(index: number, label: { text: string, href: string }) {
        if (index < position) {
            return (
                <Link href={label.href} key={index}>
                    <span className="text-[var(--off-black)] hover:text-[var(--company-red)]">
                        {label.text}
                    </span>
                </Link>
            );
        }
        return (
            <p key={index} className="text-gray-400">
                {label.text}
            </p>
        );
    }

    return (
        <div className='mt-10 max-w-[900px] mr-5 ml-5'>
            <div className="flex justify-between items-end w-[100%] mx-auto text-[.8rem] text-center leading-none mb-1 opacity-85">
                {labels.map((label, index) => renderLabels(index, label))}
            </div>
            <Line
                percent={progress}
                strokeWidth={1}
                trailWidth={1}
                strokeColor="rgb(212, 70, 55)"
                trailColor="rgb(156, 158, 159)"
                className="w-[100%] mx-auto mb-10"
            />
        </div>
    )
}
