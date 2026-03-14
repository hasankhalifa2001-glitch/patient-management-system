"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Field } from "@/components/ui/field";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";
import { registerPatient } from "@/lib/actions/patient.actions";

const RegisterForm = ({ user }: { user: User }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: "",
            email: "",
            phone: "",
        },
    });

    async function onSubmit(data: z.infer<typeof PatientFormValidation>) {
        setIsLoading(true);

        let formData;

        if (data.identificationDocument && data.identificationDocument.length > 0) {
            const blobFile = new Blob([data.identificationDocument[0]], {
                type: data.identificationDocument[0].type
            })

            formData = new FormData()
            formData.append('blobFile', blobFile)
            formData.append('fileName', data.identificationDocument[0].name)
        }

        try {
            const patientData = {
                ...data,
                userId: user.$id,
                birthDate: new Date(data.birthDate),
                identificationDocument: formData
            }

            const patient = await registerPatient(patientData)
            if (patient) router.push(`/patients/${user.$id}/new-appointment`)
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-12 flex-1">
            <section className="mb-8 space-y-4">
                <div className="header">Welcome, ....</div>
                <div className="text-dark-700">Let us know more about yourself</div>
            </section>
            <div>
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                    <section className="mb-16 space-y-8">
                        <div className="sub-header">Personal Information</div>
                        <div className="space-y-6">
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="name"
                                label="Full name"
                                placeholder="Hasan Khalifa"
                                iconSrc="/assets/icons/user.svg"
                                iconAlt="user"
                            />
                            <div className="flex flex-col gap-6 lg:flex-row">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="email"
                                    label="Email"
                                    placeholder="HasanKhalifa@gmail.com"
                                    iconSrc="/assets/icons/email.svg"
                                    iconAlt="email"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.PHONE_INPUT}
                                    control={form.control}
                                    name="phone"
                                    label="Phone Number"
                                    placeholder="(555) 123-4567"
                                />
                            </div>
                            <div className="flex flex-col gap-6 lg:flex-row">
                                <CustomFormField
                                    fieldType={FormFieldType.DATE_PICKER}
                                    control={form.control}
                                    name="birthDate"
                                    label="Date of Birth"
                                    placeholder="Select your birth date"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.SKELETON}
                                    control={form.control}
                                    name="gender"
                                    label="Gender"
                                    renderSkeleton={(field) => (
                                        <RadioGroup
                                            className="flex h-11 gap-6 lg:justify-between"
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            {GenderOptions.map((option) => {
                                                return (
                                                    <div key={option} className={`radio-group ${field.value === option ? `bg-dark-400` : ''} `}>
                                                        <RadioGroupItem value={option} id={option} />
                                                        <Label htmlFor={option} className="cursor-pointer">
                                                            {option}
                                                        </Label>
                                                    </div>
                                                );
                                            })}
                                        </RadioGroup>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col gap-6 lg:flex-row">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="address"
                                    label="Address"
                                    placeholder="14th Street, New York"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="occupation"
                                    label="Occupation"
                                    placeholder="SoftWare Engineer"
                                />
                            </div>
                            <div className="flex flex-col gap-6 lg:flex-row">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="emergencyContactName"
                                    label="Emergency contact name"
                                    placeholder="Guardian's name"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.PHONE_INPUT}
                                    control={form.control}
                                    name="emergencyContactNumber"
                                    label="Emergency contact number"
                                    placeholder="(555) 123-4567"
                                />
                            </div>
                        </div>
                    </section>
                    <section className="mb-16 space-y-8">
                        <div className="sub-header">Medical Information</div>
                        <div className="space-y-6">
                            <CustomFormField
                                fieldType={FormFieldType.SELECT}
                                control={form.control}
                                name="primaryPhysician"
                                label="Primary physician"
                                placeholder="Select a physician"
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
                            <div className="flex flex-col gap-6 lg:flex-row">
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="insuranceProvider"
                                    label="Insurance provider"
                                    placeholder="ex:BlueCross"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.INPUT}
                                    control={form.control}
                                    name="insurancePolicyNumber"
                                    label="Insurance policy number"
                                    placeholder="ex:ABC1234567"
                                />
                            </div>
                            <div className="flex flex-col gap-6 lg:flex-row">
                                <CustomFormField
                                    fieldType={FormFieldType.TEXTAREA}
                                    control={form.control}
                                    name="allergies"
                                    label="Allergies"
                                    placeholder="ex:Peanuts, Penicillin, Pollen"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.TEXTAREA}
                                    control={form.control}
                                    name="currentMedication"
                                    label="Current medication"
                                    placeholder="ex:Ibuprofen200mg.levothyroxine 50mcg"
                                />
                            </div>
                            <div className="flex flex-col gap-6 lg:flex-row">
                                <CustomFormField
                                    fieldType={FormFieldType.TEXTAREA}
                                    control={form.control}
                                    name="familyMedicalHistory"
                                    label="Family medical history"
                                    placeholder="ex:Mother had breast cancer"
                                />
                                <CustomFormField
                                    fieldType={FormFieldType.TEXTAREA}
                                    control={form.control}
                                    name="pastMedicalHistory"
                                    label="Past medical history"
                                    placeholder="ex:Asthma diagnosis in childhood"
                                />
                            </div>
                        </div>
                    </section>
                    <section className="mb-16 space-y-8">
                        <div className="sub-header">Identification and Verification</div>
                        <div className="space-y-6">
                            <CustomFormField
                                fieldType={FormFieldType.SELECT}
                                control={form.control}
                                name="identificationType"
                                label="Identification type"
                                placeholder="Select an identification type"
                            >
                                {IdentificationTypes.map((type) => {
                                    return (
                                        <SelectItem value={type} key={type}>
                                            {type}
                                        </SelectItem>
                                    );
                                })}
                            </CustomFormField>
                            <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name="identificationNumber"
                                label="Identification number"
                                placeholder="1234567"
                            />
                            <CustomFormField
                                fieldType={FormFieldType.SKELETON}
                                control={form.control}
                                name="identificationDocument"
                                label="Scanned copy of identification document"
                                renderSkeleton={(field) => (
                                    <FileUploader files={field.value} onChange={field.onChange} />
                                )}
                            />
                        </div>
                    </section>
                    <section className="mb-16 space-y-8">
                        <div className="sub-header">Consent and Privacy</div>
                        <div className="space-y-6">
                            <CustomFormField
                                fieldType={FormFieldType.CHECKBOX}
                                control={form.control}
                                name="treatmentConsent"
                                label="I consent to Consent"
                            />
                            <CustomFormField
                                fieldType={FormFieldType.CHECKBOX}
                                control={form.control}
                                name="disclosureConsent"
                                label="I consent to disclosure of information"
                            />
                            <CustomFormField
                                fieldType={FormFieldType.CHECKBOX}
                                control={form.control}
                                name="privacyConsent"
                                label="I consent to privacy policy"
                            />
                        </div>
                    </section>
                </form>
            </div>
            <div>
                <Field orientation="horizontal">
                    <SubmitButton isLoading={isLoading} form="form-rhf-demo">
                        Get Started
                    </SubmitButton>
                </Field>
            </div>
        </div>
    );
};

export default RegisterForm;
