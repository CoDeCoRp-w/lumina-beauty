"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function cancelAppointment(appointmentId: string) {
    try {
        await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: "CANCELLED" }
        });
        revalidatePath("/dashboard/appointments");
        return { success: true };
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        return { error: "Failed to cancel appointment" };
    }
}
