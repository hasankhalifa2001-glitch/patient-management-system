"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Field } from "@/components/ui/field";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { CreateAppointmentSchema, getAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { createAppointment } from "@/lib/actions/appointment.actions";

const AppointmentForm = ({
    type,
    userId,
    patientId,
}: {
    type: "create" | "cancel" | 'schedule';
    userId: string;
    patientId?: string;
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const AppointmentFormValidation = getAppointmentSchema(type)

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            cancellationReason: '',
            note: '',
            primaryPhysician: '',
            reason: '',
            schedule: new Date()
        },
    });

    async function onSubmit(data: z.infer<typeof AppointmentFormValidation>) {
        setIsLoading(true);

        let status;
        switch (type) {
            case "schedule":
                status = 'scheduled'
                break;
            case "cancel":
                status = 'cancelled'
                break;
            default:
                status = 'pending'
                break;
        }

        try {

            if (type === "create" && patientId) {
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: data.primaryPhysician,
                    schedule: new Date(data.schedule),
                    reason: data.reason!,
                    note: data.note,
                    status: status as Status
                }
                const appointment = await createAppointment(appointmentData)
                if (appointment) {
                    form.reset()
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
                }
            }


        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    let buttonLabel;

    switch (type) {
        case "cancel":
            buttonLabel = 'Cancel Appointment'
            break;
        case "create":
            buttonLabel = 'Create Appointment'
            break;
        case "schedule":
            buttonLabel = 'Cancel Appointment'
            break;
    }

    return (
        <div className="space-y-12 flex-1">
            <section className="mb-8 space-y-4">
                <div className="header">New Appointment</div>
                <div className="text-dark-700">
                    Request a new appointment in 10 seconds
                </div>
            </section>
            <div>
                <form id="form-rhf-demo-appointment" onSubmit={form.handleSubmit(onSubmit)}>
                    <section className="mb-16 space-y-8">
                        {type !== "cancel" && (
                            <div className="space-y-6">
                                <CustomFormField
                                    fieldType={FormFieldType.SELECT}
                                    control={form.control}
                                    name="primaryPhysician"
                                    label="Doctor"
                                    placeholder="Select a doctor"
                                >
                                    {Doctors.map((doctor) => {
                                        return (
                                            <SelectItem value={doctor.name} key={doctor.name}>
                                                <div className="flex cursor-pointer items-center gap-2">
                                                    <Image
                                                        src={doctor.image}
                                                        alt={doctor.name}
                                                        width={32}
                                                        height={32}
                                                        className="rounded-full border border-dark-500"
                                                    />
                                                    <p>{doctor.name}</p>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </CustomFormField>
                                <CustomFormField
                                    fieldType={FormFieldType.DATE_PICKER}
                                    control={form.control}
                                    name="schedule"
                                    label="Expected appointment date"
                                    showTimeSelect
                                    dateFormat="MM/dd/yyyy - h:mm aa"
                                    placeholder="Select your appointment date"
                                />
                                <div className="flex flex-col gap-6 lg:flex-row">
                                    <CustomFormField
                                        fieldType={FormFieldType.TEXTAREA}
                                        control={form.control}
                                        name="reason"
                                        label="Reason for appointment"
                                        placeholder="Enter reason for appointment"
                                    />
                                    <CustomFormField
                                        fieldType={FormFieldType.TEXTAREA}
                                        control={form.control}
                                        name="note"
                                        label="Notes"
                                        placeholder="Enter notes"
                                    />
                                </div>
                            </div>
                        )}
                        {type === "cancel" && (
                            <CustomFormField
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="cancellationReason"
                                label="Reason for cancellation"
                                placeholder="Enter reason for cancellation"
                            />
                        )}
                    </section>
                </form>
            </div>
            <div>
                <Field orientation="horizontal">
                    <SubmitButton
                        isLoading={isLoading}
                        form="form-rhf-demo-appointment"
                        className={`${type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"} w-full`}
                    >
                        {buttonLabel}
                    </SubmitButton>
                </Field>
            </div>
        </div>
    );
};

export default AppointmentForm;
