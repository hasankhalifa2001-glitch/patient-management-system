
import PatientForm from "@/components/forms/PatientForm";
import PassKeyModel from "@/components/PassKeyModel";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import Link from "next/link";

export default async function Home({ searchParams }: SearchParamProps) {

  const isAdmin = (await searchParams).admin === 'true'

  return (
    <div className="flex h-screen max-h-screen bg-white dark:bg-dark-300">

      {isAdmin && <PassKeyModel />}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-124">
          <div className="flex-between mb-8">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/icons/logo-icon.svg"
                alt="patient"
                height={1000}
                width={1000}
                className="h-10 w-fit"
              />
              <div className="text-2xl font-semibold">CarePules</div>
            </div>
            <ThemeToggle />
          </div>

          <PatientForm />

          <div className="text-14-regular mt-10 flex justify-between">
            <p className="justify-items-end text-slate-600 dark:text-dark-600 xl:text-left">
              © 2026 CarePulse
            </p>
            <Link href="/?admin=true" className="text-blue-600 dark:text-blue-500 hover:underline">
              Admin
            </Link>
          </div>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        alt="patient"
        height={1000}
        width={1000}
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
