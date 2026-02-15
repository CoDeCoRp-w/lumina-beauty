"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export async function createService(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const duration = parseInt(formData.get("duration") as string);

    if (!name || isNaN(price) || isNaN(duration)) {
        return { error: "Por favor completa todos los campos requeridos correctamente." };
    }

    try {
        await prisma.service.create({
            data: {
                name,
                description,
                price,
                duration,
            },
        });
    } catch (error) {
        console.error("Failed to create service:", error);
        return { error: "Error al crear el servicio." };
    }

    revalidatePath("/dashboard/services");
    redirect("/dashboard/services");
}


export async function deleteService(id: string) {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    try {
        await prisma.service.delete({
            where: { id }
        });
        revalidatePath("/dashboard/services");
    } catch (error) {
        return { error: "Error al eliminar" };
    }
}
