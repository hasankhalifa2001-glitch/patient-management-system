"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";

const RegisterForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof UserFormValidation>>({
        resolver: zodResolver(UserFormValidation),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    });

    async function onSubmit(data: z.infer<typeof UserFormValidation>) {
        setIsLoading(true);

        try {
            // const user = {
            //   name: data.name,
            //   email: data.email,
            //   phone: data.phone,
            // };
            // const user = await createUser(data);
            // if (user) router.push(`/patients/${user.id}/register`);
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
                                                    <div key={option} className="radio-group">
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
