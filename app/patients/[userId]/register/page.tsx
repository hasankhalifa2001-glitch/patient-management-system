import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import * as Sentry from "@sentry/nextjs";

const RegisterPage = async ({ params }: SearchParamProps) => {

    const { userId } = await params

    const user = await getUser(userId)

    Sentry.metrics.count("user_view_register", user.name);

    return (
        <div className="flex h-screen max-h-screen">
            <section className="remove-scrollbar container">
                <div className="sub-container max-w-220">
                    <Image
                        src={`/assets/icons/logo-full.svg`}
                        alt="patient"
                        height={1000}
                        width={1000}
                        className="mb-10 h-10 w-fit"
                    />
                    <RegisterForm user={user} />
                    <div className="text-14-regular  flex justify-between">
                        <p className="justify-items-end my-6 text-dark-600 xl:text-left">
                            © 2026 CarePulse
                        </p>
                    </div>
                </div>
            </section>
            <Image
                src={`/assets/images/register-img.png`}
                alt="patient"
                height={1000}
                width={1000}
                className="side-img max-w-100"
            />
        </div>
    )
}

export default RegisterPage