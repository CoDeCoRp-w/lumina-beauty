"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createStaff } from "@/actions/staff";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { useEffect } from "react";

// Initial state for the form
const initialState = {
    error: "",
    message: "",
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Guardando..." : "Crear Estilista"}
        </Button>
    );
}

export default function NewStaffPage() {
    const [state, formAction] = useActionState(createStaff, initialState);

    useEffect(() => {
        if (state.error) {
            // Optionally show toast here if you had one
        }
    }, [state]);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/staff" className="text-muted-foreground hover:text-primary">
                    ← Volver
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Nuevo Miembro</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Información del Personal</CardTitle>
                    <CardDescription>
                        Añade un nuevo estilista o administrador al sistema.
                        La contraseña por defecto será: <strong>beauty_system_staff</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {state.error && (
                        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
                            {state.error}
                        </div>
                    )}
                    <form action={formAction} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input id="name" name="name" placeholder="Ej. Ana García" required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input id="email" name="email" type="email" placeholder="ana@beauty.com" required />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input id="password" name="password" type="password" placeholder="******" required minLength={6} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="role">Rol</Label>
                            <Select name="role" defaultValue="STAFF">
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STAFF">Estilista (Staff)</SelectItem>
                                    <SelectItem value="ADMIN">Administrador</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-4 flex justify-end gap-2">
                            <Link href="/dashboard/staff">
                                <Button type="button" variant="outline">Cancelar</Button>
                            </Link>
                            <SubmitButton />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
