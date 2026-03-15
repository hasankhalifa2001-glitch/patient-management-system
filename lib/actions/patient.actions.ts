"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    NEXT_PUBLIC_APPWRITE_ENDPOINT,
    NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    NEXT_PUBLIC_BUCKET_ID,
    NEXT_PUBLIC_DATABASE_ID,
    NEXT_PUBLIC_PATIENT_TABLE_ID,
    storage,
    tablesDB,
    users,
} from "../appwrite.config";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { InputFile } from "node-appwrite/file";

export const createUser = async (user: CreateUserParams) => {
    try {
        const newUser = await users.create({
            userId: ID.unique(),
            email: user.email,
            phone: user.phone,
            name: user.name,
        });
        console.log(newUser)

        return parseStringify(newUser);

    } catch (error: any) {
        console.log(error);
        if (error && error?.code === 409) {
            const documents = await users.list({
                queries: [Query.equal("email", [user.email])],
            });
            return parseStringify(documents.users[0])
        }
    }
};

export const getUser = async (userId: string) => {
    try {
        const user = await users.get({ userId });
        return parseStringify(user);
    } catch (error) {
        console.log(error);
    }
};

export const registerPatient = async ({
    identificationDocument,
    ...patient
}: {
    identificationDocument: FormData | undefined;
}) => {
    try {
        let file;

        if (identificationDocument) {
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get("blobFile") as Blob,
                identificationDocument?.get("fileName") as string,
            );
            file = await storage.createFile({
                bucketId: NEXT_PUBLIC_BUCKET_ID!,
                file: inputFile,
                fileId: ID.unique(),
            });
        }

        const newPatient = await tablesDB.createRow({
            databaseId: NEXT_PUBLIC_DATABASE_ID!,
            tableId: NEXT_PUBLIC_PATIENT_TABLE_ID!,
            rowId: ID.unique(),
            data: {
                identificationDocumentId: file?.$id || null,
                identificationDocumentUrl: `${NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${NEXT_PUBLIC_BUCKET_ID}/files/${file?.$id}/view?project=${NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
                ...patient,
            }
        })
        return parseStringify(newPatient)
    } catch (error) {
        console.log(error);
    }
};

export const getpatient = async (userId: string) => {
    try {

        const patient = await tablesDB.listRows({
            databaseId: NEXT_PUBLIC_DATABASE_ID!,
            tableId: NEXT_PUBLIC_PATIENT_TABLE_ID!,
            queries: [Query.equal('userId', userId)]
        })

        return parseStringify(patient.rows[0]);
    } catch (error) {
        console.log(error);
    }
};