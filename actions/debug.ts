"use server";

import { prisma } from "@/lib/prisma";

export async function createTestAppointment() {
    try {
        // 1. Get any service
        const service = await prisma.service.findFirst();
        if (!service) return { error: "No services found to create test appointment" };

        // 2. Get/Create User
        let user = await prisma.user.findUnique({ where: { email: "test@example.com" } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: "test@example.com",
                    name: "Test User",
                    password: "password", // hashed in real app
                    role: "CUSTOMER"
                }
            });
        }

        // 3. Create Appointment
        const appointment = await prisma.appointment.create({
            data: {
                userId: user.id,
                serviceId: service.id,
                startDateTime: new Date(),
                status: "PENDING"
            }
        });

        return { success: true, appointmentId: appointment.id };
    } catch (e) {
        console.error(e);
        return { error: "Failed to create test appointment" };
    }
}
