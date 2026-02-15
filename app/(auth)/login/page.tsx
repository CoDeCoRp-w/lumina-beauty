"use client";

import { useActionState } from "react"; // Next.js 15 / React 19
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, null);

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <div className="w-full max-w-sm space-y-6 rounded-lg border bg-card p-6 shadow-lg md:p-8">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Bienvenido</h1>
                    <p className="text-sm text-muted-foreground">
                        Ingresa tu correo para acceder a tu cuenta
                    </p>
                </div>

                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="nombre@ejemplo.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Contraseña</Label>
                            <Link
                                href="#"
                                className="text-xs text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                        <Input id="password" name="password" type="password" required />
                    </div>

                    {state?.error && (
                        <p className="text-sm text-destructive text-center font-medium">
                            {state.error}
                        </p>
                    )}

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Iniciando sesión...
                            </>
                        ) : (
                            "Ingresar"
                        )}
                    </Button>
                </form>

                <div className="text-center text-sm text-muted-foreground">
                    ¿No tienes una cuenta?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                        Regístrate
                    </Link>
                </div>
            </div>
        </div>
    );
}
