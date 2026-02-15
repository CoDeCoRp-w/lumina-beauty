import { prisma } from "@/lib/prisma";

async function main() {
    const appointments = await prisma.appointment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    console.log(appointments.map(a => ({
        id: a.id,
        start: a.startDateTime,
        staffId: a.staffId,
        status: a.status
    })));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
