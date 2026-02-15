"use server";

import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Register Action
export async function register(prevState: any, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password || !name) {
        return { error: "Por favor, completa todos los campos." };
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { error: "El correo electrónico ya está en uso." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER", // Default role
            },
        });

        await createSession(user.id, user.role);

        // Redirect must be outside try/catch or it will be caught as an error
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Algo salió mal. Por favor intenta de nuevo." };
    }

    redirect("/dashboard");
}

// Login Action
export async function login(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Por favor ingresa correo y contraseña." };
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { error: "Credenciales inválidas." };
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
            return { error: "Credenciales inválidas." };
        }

        await createSession(user.id, user.role);
    } catch (error) {
        console.error("Login error:", error);
        return { error: "Algo salió mal." };
    }

    redirect("/dashboard");
}

// Logout Action
export async function logout() {
    await deleteSession();
    redirect("/login");
}
