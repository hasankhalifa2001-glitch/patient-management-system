"use server";

import { ID, Query } from "node-appwrite";
import {
    NEXT_PUBLIC_APPOINTMENT_TABLE_ID,
    NEXT_PUBLIC_DATABASE_ID,
    tablesDB,
} from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "./appwrite.types";
import { revalidatePath } from "next/cache";

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
        const appointment = await tablesDB.getRow({
            databaseId: NEXT_PUBLIC_DATABASE_ID!,
            tableId: NEXT_PUBLIC_APPOINTMENT_TABLE_ID!,
            rowId: appointmentId
        })
        return parseStringify(appointment)
    } catch (error) {
        console.log(error)
    }
};

export const getRecentAppointmentList = async () => {

    try {
        const appointments = await tablesDB.listRows({
            databaseId: NEXT_PUBLIC_DATABASE_ID!,
            tableId: NEXT_PUBLIC_APPOINTMENT_TABLE_ID!,
            queries: [
                Query.orderDesc("$createdAt"),
                Query.select(["*", "patient.*"])
            ]
        })

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        }

        const counts = (appointments.rows as unknown as Appointment[]).reduce((acc, appointment) => {
            if (appointment.status === 'scheduled') {
                acc.scheduledCount += 1;
            } else if (appointment.status === 'pending') {
                acc.pendingCount += 1;
            } else if (appointment.status === 'cancelled') {
                acc.cancelledCount += 1;
            }

            return acc;

        }, initialCounts)

        const data = {
            totalCount: appointments.total,
            ...counts,
            rows: appointments.rows
        }

        return parseStringify(data)

    } catch (error) {
        console.log(error)
    }

}

export const updateAppointment = async ({ appointmentId, userId, appointment, type }: UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await tablesDB.updateRow({
            databaseId: NEXT_PUBLIC_DATABASE_ID!,
            tableId: NEXT_PUBLIC_APPOINTMENT_TABLE_ID!,
            rowId: appointmentId!,
            data: {
                ...appointment
            }
        })

        if (!updatedAppointment) {
            throw new Error('Failed to update appointment')
        }

        revalidatePath('/admin')
        return parseStringify(updatedAppointment)
    } catch (error) {
        console.log(error)
    }
}