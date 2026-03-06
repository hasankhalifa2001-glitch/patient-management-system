import PatientForm from "@/components/forms/PatientForm";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen max-h-screen">
      {/* TODO: OTP Verification | PassKeyModel */}
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-110">
          <Image
            src={`/assets/icons/logo-full.svg`}
            alt="patient"
            height={1000}
            width={1000}
            className="mb-10 h-10 w-fit"
          />
          <PatientForm />
          <div className="text-14-regular mt-6 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2026 CarePulse
            </p>
            <Link href={`/?admin=true`} className="text-green-500">
              admin
            </Link>
          </div>
        </div>
      </section>
      <Image
        src={`/assets/images/onboarding-img.png`}
        alt="patient"
        height={1000}
        width={1000}
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
