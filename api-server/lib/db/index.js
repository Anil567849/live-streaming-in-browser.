
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function saveToDB(key){
    await prisma.user.create({
        data: {
            key
        }
    })
}