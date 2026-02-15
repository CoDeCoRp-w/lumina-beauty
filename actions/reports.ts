"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export async function getRevenueStats(stylistId?: string) {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    const whereCondition: any = {
        status: { in: ["COMPLETED", "CONFIRMED"] } // We count confirmed as revenue projection too, or just COMPLETED? Usually paid ones.
        // Let's assume CONFIRMED is booked but maybe not paid? Or PAID/COMPLETED. 
        // For simplest revenue "Projection", we use CONFIRMED + COMPLETED.
    };

    if (stylistId && stylistId !== "all") {
        whereCondition.staffId = stylistId;
    }

    try {
        const appointments = await prisma.appointment.findMany({
            where: whereCondition,
            include: {
                service: true,
                staff: true,
                user: true, // Include customer
            },
            orderBy: { startDateTime: "desc" }
        });

        const totalRevenue = appointments.reduce((sum, app) => sum + app.service.price, 0);
        const totalAppointments = appointments.length;

        // Group by Stylist (for "All" overview)
        const byStylist = appointments.reduce((acc: any, app) => {
            const name = app.staff?.name || "Sin Asignar";
            acc[name] = (acc[name] || 0) + app.service.price;
            return acc;
        }, {});

        return {
            totalRevenue,
            totalAppointments,
            appointments,
            byStylist,
        };
    } catch (error) {
        console.error("Error fetching revenue stats:", error);
        return { error: "Error loading reports" };
    }
}

export async function getStylistsForFilter() {
    return await prisma.user.findMany({
        where: { role: { in: ["STAFF", "ADMIN"] } },
        select: { id: true, name: true }
    });
}
