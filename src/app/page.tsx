import Link from "next/link";

export default function Home() {

  return (
    <main>
      <div className="h-[100vh] max-w-500px mx-auto">
        <div>
          
        </div>
        <p>Thank you for choosing Fargo Sterile Services.</p>
        <p>Please complete the following to complete your onboarding</p>
        <Link
          href={'/facilityInformation'}
        >Start Application</Link>
      </div>
    </main>
  );
}
