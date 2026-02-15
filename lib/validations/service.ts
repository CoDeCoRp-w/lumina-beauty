import { z } from "zod";

// Service validation schema
export const serviceSchema = z.object({
    name: z
        .string()
        .min(1, "El nombre del servicio es requerido")
        .min(3, "El nombre debe tener al menos 3 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),
    description: z
        .string()
        .max(500, "La descripción no puede exceder 500 caracteres")
        .optional()
        .nullable(),
    price: z
        .number()
        .min(0.01, "El precio debe ser mayor a 0")
        .max(10000, "El precio no puede exceder 10,000 Bs"),
    duration: z
        .number()
        .int("La duración debe ser un número entero")
        .min(30, "La duración mínima es 30 minutos")
        .max(480, "La duración máxima es 8 horas")
        .multipleOf(30, "La duración debe ser múltiplo de 30 minutos"),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
