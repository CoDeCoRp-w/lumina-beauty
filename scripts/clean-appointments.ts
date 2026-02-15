
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Cleaning up appointments...");
    try {
        await prisma.appointment.deleteMany({});
        console.log("All appointments deleted.");
    } catch (e) {
        console.error("Error deleting appointments:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
