"use server";

import { bnb } from "@/lib/bnb";
import { prisma } from "@/lib/prisma";

export async function generatePaymentQR(appointmentId: string) {
    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { service: true }
        });

        if (!appointment) return { error: "Cita no encontrada" };

        const gloss = `Pago Cita ${appointment.service.name}`;
        const amount = appointment.service.price;

        const qrResponse = await bnb.generateQR(amount, gloss);

        if ("error" in qrResponse) {
            return { error: qrResponse.error || "Error al conectar con BNB" };
        }

        if (qrResponse.success) {
            return { success: true, qr: qrResponse.qr, id: qrResponse.id };
        } else {
            return { error: qrResponse.message || "Error al generar QR" };
        }

    } catch (error) {
        console.error("Generate Payment Error:", error);
        return { error: "Error de conexión con BNB" };
    }
}

export async function checkPaymentStatus(qrId: string, appointmentId: string) {
    try {
        const statusResponse = await bnb.checkStatus(qrId);

        if ("error" in statusResponse) {
            return { success: false, status: "ERROR", message: statusResponse.error };
        }

        if (statusResponse.success && statusResponse.qrId === 2) {
            // 2 = USADO (Pagado)

            // Confirm Appointment
            await prisma.appointment.update({
                where: { id: appointmentId },
                data: { status: "CONFIRMED" }
            });

            return { success: true, status: "PAID" };
        } else if (statusResponse.qrId === 3) {
            return { success: false, status: "EXPIRED" };
        }

        return { success: false, status: "PENDING" };

    } catch (error) {
        console.error("Check Status Error:", error);
        return { error: "Error al verificar pago" };
    }
}
