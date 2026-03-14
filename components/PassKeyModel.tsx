"use client";
import { useEffect, useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,

} from "./ui/alert-dialog";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "./ui/input-otp";
import { decryptKey, encryptKey } from "@/lib/utils";

const PassKeyModel = () => {
    const router = useRouter();
    const path = usePathname()

    const [open, setOpen] = useState(true);
    const [passkey, setPasskey] = useState("");
    const [error, setError] = useState("");


    const closeModel = () => {
        setOpen(false);
        router.push("/");
    };

    console.log(typeof window)

    const encryptedKey =
        typeof window !== "undefined"
            ? window.localStorage.getItem("accessKey")
            : null;

    console.log(encryptedKey)
    console.log(path)

    useEffect(() => {

        const accessKey = encryptedKey && decryptKey(encryptedKey)

        if (path) {
            if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
                router.push('/admin')
            }
        }

    }, [encryptedKey, path, router])

    const validatePasskey = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault();

        if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedKey = encryptKey(passkey);
            localStorage.setItem("accessKey", encryptedKey);
            setOpen(false);
        } else {
            setError("Invalid passkey. Please try again");
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="shad-alert-dialog">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-start justify-between w-full">
                        Admin Access Verification
                        <Image
                            src={"/assets/icons/close.svg"}
                            alt="close"
                            width={20}
                            height={20}
                            onClick={() => closeModel()}
                            className="cursor-pointer"
                        />
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        To access the admin page, please enter the passkey.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div>
                    <InputOTP
                        maxLength={6}
                        value={passkey}
                        onChange={(value) => setPasskey(value)}
                    >
                        <InputOTPGroup className="shad-otp">
                            <InputOTPSlot index={0} className="shad-otp-slot" />
                            <InputOTPSlot index={1} className="shad-otp-slot" />
                            <InputOTPSlot index={2} className="shad-otp-slot" />
                            <InputOTPSlot index={3} className="shad-otp-slot" />
                            <InputOTPSlot index={4} className="shad-otp-slot" />
                            <InputOTPSlot index={5} className="shad-otp-slot" />
                        </InputOTPGroup>
                    </InputOTP>

                    {error && (
                        <p className="shad-error text-14-regular mt-4 flex justify-center">
                            {error}
                        </p>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogAction
                        className="shad-primary-btn w-full"
                        onClick={(e) => validatePasskey(e)}
                    >
                        Enter Admin Passkey
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default PassKeyModel;
