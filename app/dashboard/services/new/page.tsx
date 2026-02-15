"use client";

import { useActionState } from "react";
import { createService } from "@/actions/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewServicePage() {
    const [state, formAction, isPending] = useActionState(createService, null);

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/services">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-semibold tracking-tight">Agregar Nuevo Servicio</h1>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Servicio</Label>
                        <Input id="name" name="name" placeholder="ej. Corte & Estilo" required />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="price">Precio (Bs)</Label>
                            <Input id="price" name="price" type="number" step="0.01" placeholder="0.00" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duración</Label>
                            <Select name="duration" defaultValue="30">
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona duración" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30">30 min</SelectItem>
                                    <SelectItem value="60">1 hora</SelectItem>
                                    <SelectItem value="90">1 hora 30 min</SelectItem>
                                    <SelectItem value="120">2 horas</SelectItem>
                                    <SelectItem value="150">2 horas 30 min</SelectItem>
                                    <SelectItem value="180">3 horas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe el servicio..."
                            className="resize-none"
                            rows={4}
                        />
                    </div>

                    {state?.error && (
                        <p className="text-sm text-destructive font-medium">
                            {state.error}
                        </p>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                "Crear Servicio"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
