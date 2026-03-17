
import AppointmentForm from "@/components/forms/AppointmentForm";
import { getpatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import * as Sentry from "@sentry/nextjs";


const NewAppointmentPage = async ({ params }: SearchParamProps) => {

    const { userId } = await params

    const patient = await getpatient(userId)

    Sentry.metrics.count("user_view_new-appointment", patient.name);


    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container my-auto">
                <div className="sub-container max-w-220">
                    <Image
                        src={`/assets/icons/logo-full.svg`}
                        alt="patient"
                        height={1000}
                        width={1000}
                        className="mb-10 h-10 w-fit"
                    />
                    <AppointmentForm
                        type='create'
                        userId={userId}
                        patientId={patient?.$id}
                    />
                    <p className="justify-items-end my-6 text-dark-600 xl:text-left">
                        © 2026 CarePulse
                    </p>
                </div>
            </section>
            <Image
                src={`/assets/images/appointment-img.png`}
                alt="patient"
                height={1000}
                width={1000}
                className="side-img max-w-100 bg-bottom"
            />
        </div>
    )
}

export default NewAppointmentPage