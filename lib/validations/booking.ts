import { z } from "zod";

// Booking client info validation
export const bookingClientSchema = z.object({
    clientName: z
        .string()
        .min(1, "El nombre es requerido")
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre no puede exceder 100 caracteres"),
    clientEmail: z
        .string()
        .min(1, "El correo electrónico es requerido")
        .email("Correo electrónico inválido"),
});

export type BookingClientData = z.infer<typeof bookingClientSchema>;

// Complete booking validation
export const bookingSchema = z.object({
    serviceId: z.string().min(1, "Debes seleccionar un servicio"),
    staffId: z.string().min(1, "Debes seleccionar un estilista"),
    date: z.coerce.date(),
    time: z.string().min(1, "Debes seleccionar un horario"),
    clientName: z
        .string()
        .min(1, "El nombre es requerido")
        .min(2, "El nombre debe tener al menos 2 caracteres"),
    clentEmail: z
        .string()
        .min(1, "El correo electrónico es requerido")
        .email("Correo electrónico inválido"),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
