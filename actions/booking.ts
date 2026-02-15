"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function getAvailableServices() {
    try {
        return await prisma.service.findMany({
            orderBy: { name: "asc" },
        });
    } catch (error) {
        console.error("Error fetching services:", error);
        return [];
    }
}

export async function getAvailableStaff() {
    try {
        return await prisma.user.findMany({
            where: { role: "STAFF" },
            select: { id: true, name: true, role: true },
            orderBy: { name: "asc" },
        });
    } catch (error) {
        console.error("Error fetching staff:", error);
        return [];
    }
}

export async function getAvailableSlots(date: Date, staffId: string) {
    if (!date || !staffId) return [];

    // 1. Define Business Hours (9:00 - 17:00)
    const startHour = 9;
    const endHour = 17;
    const interval = 30; // minutes

    // 2. Fetch Existing Appointments for that Staff & Date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await prisma.appointment.findMany({
        where: {
            // If "any", strict checking is harder, but for specific staff:
            ...(staffId !== "any" ? { staffId } : {}),
            startDateTime: {
                gte: startOfDay,
                lte: endOfDay
            },
            status: { not: "CANCELLED" }
        },
        include: { service: true }
    });

    // 3. Generate All Possible Slots
    const allSlots = [];
    for (let hour = startHour; hour < endHour; hour++) {
        for (let min = 0; min < 60; min += interval) {
            const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            allSlots.push(timeString);
        }
    }

    // 4. Filter Conflicting Slots
    const availableSlots = allSlots.filter(slot => {
        const [slotHour, slotMin] = slot.split(":").map(Number);

        // Construct date for this slot
        const slotDate = new Date(date);
        slotDate.setHours(slotHour, slotMin, 0, 0);

        // Check against existing appointments
        // A slot is occupied if it starts during another appointment
        // OR if the appointment starts during this slot (though slots are points in time)
        // Main check: Is slotDate inside [appt.start, appt.end)?
        const isOccupied = existingAppointments.some((appt: any) => {
            // If we selected "any" staff, we simply can't double book the SAME PERSON.
            // But logic is complex. For now, if staffId is specific, check collisions.
            if (staffId !== "any" && appt.staffId !== staffId) return false;

            const apptStart = new Date(appt.startDateTime);
            const duration = appt.service.duration;
            const apptEnd = new Date(apptStart.getTime() + duration * 60000);

            return slotDate >= apptStart && slotDate < apptEnd;
        });

        return !isOccupied;
    });

    return availableSlots;
}

export async function createBooking(data: {
    serviceId: string;
    staffId: string;
    date: Date;
    time: string;
    clientName: string;
    clientEmail: string;
}) {
    const { serviceId, staffId, date, time, clientName, clientEmail } = data;

    try {
        // 1. Find or Create User
        let user = await prisma.user.findUnique({
            where: { email: clientEmail }
        });

        if (!user) {
            // Create a new customer with a temp password
            const hashedPassword = await bcrypt.hash("tempPass123!", 10);
            user = await prisma.user.create({
                data: {
                    name: clientName,
                    email: clientEmail,
                    password: hashedPassword,
                    role: "CUSTOMER"
                }
            });
        }

        // 2. Parse DateTime
        // Currently 'date' comes as ISO string or Date object. 
        // We combine date + time string (HH:mm) into a single DateTime
        const [hours, minutes] = time.split(":").map(Number);
        const appointmentDate = new Date(date);
        appointmentDate.setHours(hours, minutes, 0, 0);

        // 3. Create Appointment
        const appointment = await prisma.appointment.create({
            data: {
                userId: user.id,
                serviceId: serviceId,
                staffId: staffId !== "any" ? staffId : undefined, // If "any", we might need logic to pick one, but for now leave null or undefined.
                // Note: Schema should allow nullable staffId if "any" is valid, OR we pick one here. 
                // For this MVP, if "any" is picked, we ironically don't assign anyone? 
                // Better to assign a random one or the first available. 
                // Let's leave it null for "any" if schema allows (I made it nullable).
                startDateTime: appointmentDate,
                status: "PENDING" // Wait for payment
            }
        });

        return { success: true, bookingId: appointment.id };

    } catch (error) {
        console.error("Booking error:", error);
        return { error: "Error al procesar la reserva." };
    }
}
