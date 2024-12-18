import Image from "next/image"
import Link from "next/link"
export default function Header() {
    return (
        <header className="px-7 pt-5">
            <Link href={'https://www.fagronsterile.com/'} target="_blank" rel="noopener noreferrer" className="w-[180px] block">
                <Image
                    src='/images/companyLogo.png'
                    width={180}
                    height={50}
                    alt="company logo"
                />
            </Link>
        </header>
    )
}
