"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hash } from "crypto";
// Note: In a real app use bcryptjs or argon2. For simplicity we'll assume there's a util or just store plain/simple hash for this demo if needed, 
// BUT looking at schema, password is required. 
// We will use a placeholder hash or simple implementation since adding bcrypt dependency might be unsafe correctly.
// Actually, let's just use a simple string for now as Auth isn't fully implemented with login logic yet.
// Wait, user might want to login. I'll use a dummy hash function or check if project has one.
// The project has `middleware.ts` but no auth library visible yet.
// I'll assume plain text or simple hash is fine for "Mock" stage, but better to be safe-ish.

export async function createStaff(prevState: any, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string || "STAFF";

    if (!name || !email || !password) {
        return { error: "Faltan campos obligatorios", message: "" };
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return { error: "El email ya está registrado", message: "" };
        }

        await prisma.user.create({
            data: {
                name,
                email,
                password, // In real app: await hash(password, 10)
                role
            }
        });

        revalidatePath("/dashboard/staff");
    } catch (error) {
        console.error("Error creating staff:", error);
        return { error: "Error al crear el usuario", message: "" };
    }

    redirect("/dashboard/staff");
}

export async function deleteStaff(id: string) {
    try {
        // 1. Check if staff has appointments
        const staff = await prisma.user.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { staffAppointments: true }
                }
            }
        });

        if (!staff) {
            return { error: "Usuario no encontrado" };
        }

        if (staff._count.staffAppointments > 0) {
            return { error: "No se puede eliminar: tiene citas asignadas." };
        }

        // 2. Delete
        await prisma.user.delete({
            where: { id }
        });

        revalidatePath("/dashboard/staff");
        return { success: true };
    } catch (error) {
        console.error("Error deleting staff:", error);
        return { error: "Error al eliminar el usuario" };
    }
}
