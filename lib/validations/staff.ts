import { z } from "zod";

// Staff validation schema
export const staffSchema = z.object({
    name: z
        .string()
        .min(1, "El nombre es requerido")
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),
    email: z
        .string()
        .min(1, "El correo electrónico es requerido")
        .email("Correo electrónico inválido"),
    password: z
        .string()
        .min(1, "La contraseña es requerida")
        .min(8, "La contraseña debe tener al menos 8 caracteres"),
    role: z.enum(["STAFF", "ADMIN"]),
});

export type StaffFormData = z.infer<typeof staffSchema>;
