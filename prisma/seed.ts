import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10)

    const user = await prisma.user.upsert({
        where: { email: 'admin@beauty.com' },
        update: {},
        create: {
            email: 'admin@beauty.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })

    console.log({ user })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
