"use client";

import Image from "next/image";
import { Button } from "./ui/button";

interface ButtonProps {
    form?: string
    isLoading: boolean;
    className?: string;
    children: React.ReactNode;
}
const SubmitButton = ({ form, isLoading, className, children }: ButtonProps) => {
    return (
        <Button
            type="submit"
            className={className ?? "shad-primary-btn w-full"}
            disabled={isLoading}
            form={form}
        >
            {isLoading ? (
                <div className="flex items-center gap-4">
                    <Image
                        src={"/assets/icons/loader.svg"}
                        alt="loading"
                        height={24}
                        width={24}
                        className="animate-spin"
                    />
                    Loading...
                </div>
            ) : (
                children
            )}
        </Button>
    );
};

export default SubmitButton;
