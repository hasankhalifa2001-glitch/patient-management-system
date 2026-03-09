/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
    Control,
    Controller,
    ControllerFieldState,
    ControllerRenderProps,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { FormFieldType } from "./forms/PatientForm";
import Image from "next/image";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/core";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";

interface CustomProps {
    fieldType: FormFieldType;
    control: Control<any>;
    name: string;
    label?: string;
    placeholder?: string;
    iconSrc?: string;
    iconAlt?: string;
    disabled?: boolean;
    dateFormat?: string;
    showTimeSelect?: boolean;
    children?: React.ReactNode;
    renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderField = ({
    field,
    fieldState,
    props,
}: {
    field: ControllerRenderProps<any, string>;
    fieldState: ControllerFieldState;
    props: CustomProps;
}) => {
    const { fieldType, name, iconAlt, iconSrc, placeholder, renderSkeleton } =
        props;
    switch (fieldType) {
        case FormFieldType.INPUT:
            return (
                <div className="flex rounded-md items-center border h-11 border-dark-500 bg-dark-400">
                    {iconSrc && iconAlt && (
                        <Image
                            src={iconSrc}
                            alt={iconAlt}
                            height={24}
                            width={24}
                            className="ml-2"
                        />
                    )}
                    <Input
                        {...field}
                        id="form-rhf-demo-title"
                        aria-invalid={fieldState.invalid}
                        placeholder={placeholder}
                        autoComplete="off"
                        className="shad-input border-0"
                        type="text"
                        name={name}
                    />
                </div>
            );
        case FormFieldType.PHONE_INPUT:
            return (
                <PhoneInput
                    defaultCountry="US"
                    placeholder={placeholder}
                    international
                    withCountryCallingCode
                    value={field.value as E164Number | undefined}
                    onChange={field.onChange}
                    className="input-phone border "
                />
            );
        case FormFieldType.DATE_PICKER:
            return (
                <div className="flex rounded-md border h-11 border-dark-500 bg-dark-400">
                    <Image
                        src={"/assets/icons/calendar.svg"}
                        height={24}
                        width={24}
                        alt="calendar"
                        className="ml-2"
                    />
                </div>
            );
        case FormFieldType.SELECT:
            return (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="shad-select-trigger">
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent className="shad-select-content">
                        {props.children}
                    </SelectContent>
                </Select>
            );
        case FormFieldType.SKELETON:
            return renderSkeleton ? renderSkeleton(field) : null;
        default:
            break;
    }
};

const CustomFormField = (props: CustomProps) => {
    const { control, fieldType, name, label } = props;
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    {fieldType !== FormFieldType.CHECKBOX && label && (
                        <FieldLabel
                            htmlFor="form-rhf-demo-title"
                            className="shad-input-label"
                        >
                            {label}
                        </FieldLabel>
                    )}

                    <RenderField field={field} fieldState={fieldState} props={props} />

                    {fieldState.invalid && (
                        <FieldError className="shad-error" errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
    );
};

export default CustomFormField;
