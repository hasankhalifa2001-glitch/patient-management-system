"use server";

import { ID, Query } from "node-appwrite";
import {
    NEXT_PUBLIC_APPOINTMENT_TABLE_ID,
    NEXT_PUBLIC_DATABASE_ID,
    tablesDB,
} from "../appwrite.config";
import { parseStringify } from "../utils";

export const createAppointment = async (
    appointment: CreateAppointmentParams,
) => {
    try {
        const newAppointment = await tablesDB.createRow({
            databaseId: NEXT_PUBLIC_DATABASE_ID!,
            tableId: NEXT_PUBLIC_APPOINTMENT_TABLE_ID!,
            rowId: ID.unique(),
            data: {
                ...appointment,
            }
        })
        return parseStringify(newAppointment);
    } catch (error) {
        console.log(error);
    }
};

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await tablesDB.listRows({
            databaseId: NEXT_PUBLIC_DATABASE_ID!,
            tableId: NEXT_PUBLIC_APPOINTMENT_TABLE_ID!,
            queries: [Query.equal('appointmentId', appointmentId)]
        })
        return parseStringify(appointment.rows[0])
    } catch (error) {
        console.log(error)
    }
};
