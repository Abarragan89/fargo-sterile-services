import Link from "next/link";

export default function Home() {

  return (
    <main className="h-[100vh] max-w-500px mx-auto">
      <div className="h-[50vh]  flex flex-col justify-center items-center">
        <p>Thank you for choosing Fargo Sterile Services.</p>
        <p>Please complete the following application.</p>
        <Link
          className="custom-small-btn bg-[var(--company-red)] mt-7"
          href={'/facilityInformation'}
        >Start Application</Link>

      </div>
    </main>
  );
}
