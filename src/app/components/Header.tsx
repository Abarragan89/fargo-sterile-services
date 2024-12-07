import Image from "next/image"

export default function Header() {
    return (
        <header className="px-3 pt-3">
            <Image
                src='/images/companyLogo.png'
                width={180}
                height={50}
                alt="company logo"
            />
        </header>
    )
}
