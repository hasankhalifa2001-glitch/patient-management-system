'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { users } from "../appwrite.config"
import { ID, Query } from 'node-appwrite'
import { parseStringify } from "../utils"

export const createUser = async (user: CreateUserParams) => {

    try {

        const newUser = await users.create({
            userId: ID.unique(),
            email: user.email,
            phone: user.phone,
            name: user.name,
        })

        return parseStringify(newUser)
    } catch (error: any) {
        if (error && error?.code === 409) {
            const documents = await users.list({
                queries: [
                    Query.equal('email', [user.email])
                ]
            });
            return documents?.users[0]
        }
    }


}

export const getUser = async (userId: string) => {
    try {
        const user = await users.get({ userId })
        return parseStringify(user)
    } catch (error) {
        console.log(error)
    }
}