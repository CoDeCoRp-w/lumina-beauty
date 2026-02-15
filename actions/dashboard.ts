"use server";

import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, startOfHour, endOfHour } from "date-fns";

export async function getDashboardStats() {
    const now = new Date();
    const firstDayOfMonth = startOfMonth(now);
    const lastDayOfMonth = endOfMonth(now);

    try {
        // 1. Total Revenue (This Month)
        // We sum the price of all services for non-cancelled appointments this month
        const revenueResult = await prisma.appointment.findMany({
            where: {
                startDateTime: {
                    gte: firstDayOfMonth,
                    lte: lastDayOfMonth
                },
                status: { not: "CANCELLED" }
            },
            include: {
                service: {
                    select: { price: true }
                }
            }
        });

        const totalRevenue = revenueResult.reduce((acc, curr) => acc + curr.service.price, 0);

        // 2. Appointments Count (This Month)
        const appointmentsCount = await prisma.appointment.count({
            where: {
                startDateTime: {
                    gte: firstDayOfMonth,
                    lte: lastDayOfMonth
                },
                status: { not: "CANCELLED" }
            }
        });

        // 3. New Clients (This Month)
        const newClientsCount = await prisma.user.count({
            where: {
                role: "CUSTOMER",
                createdAt: {
                    gte: firstDayOfMonth,
                    lte: lastDayOfMonth
                }
            }
        });

        // 4. Active Now (Appointments happening right now)
        // This is tricky without knowing end time in DB directly (we compute it).
        // For simplicity, we'll count appointments starting in the current hour.
        const activeNowCount = await prisma.appointment.count({
            where: {
                startDateTime: {
                    gte: startOfHour(now),
                    lte: endOfHour(now)
                },
                status: { not: "CANCELLED" }
            }
        });

        // 5. Recent Appointments
        const recentAppointments = await prisma.appointment.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                user: true,
                service: true
            }
        });

        // 6. Today's Agenda
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const todayAppointments = await prisma.appointment.findMany({
            where: {
                startDateTime: {
                    gte: startOfToday,
                    lte: endOfToday
                },
                status: { not: "CANCELLED" }
            },
            orderBy: { startDateTime: "asc" },
            include: {
                user: true,
                service: true,
                staff: true,
            }
        });

        return {
            totalRevenue,
            appointmentsCount,
            newClientsCount,
            activeNowCount,
            recentAppointments,
            todayAppointments
        };

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            totalRevenue: 0,
            appointmentsCount: 0,
            newClientsCount: 0,
            activeNowCount: 0,
            recentAppointments: [],
            todayAppointments: []
        };
    }
}
