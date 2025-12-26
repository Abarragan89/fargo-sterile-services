"use client"
import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { saveFormData } from "../../utils/indexedDBActions";

export default function Home() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    async function saveSalesPersonId() {
      try {
        await saveFormData({
          salesPersonId: id
        })
      } catch (error) {
        console.error('error saving data', error)
      } 
    }
    saveSalesPersonId()
  }, [id, searchParams])

  return (
    <main className="h-[100vh] max-w-500px mx-auto">
      <div className="h-[50vh]  flex flex-col justify-center items-center">
        <p>Thank you for choosing Fagron Sterile Services.</p>
        <p>Please complete the following application.</p>
        <Link
          className="custom-small-btn bg-[var(--company-red)] mt-7"
          href={'/facilityInformation'}
        >Start Application
        </Link>

      </div>
    </main>
  );
}
