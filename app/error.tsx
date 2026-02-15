"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to error reporting service
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-muted/20">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-destructive">¡Oops! Algo salió mal</CardTitle>
                    <CardDescription>
                        Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {process.env.NODE_ENV === "development" && (
                        <div className="rounded-lg bg-destructive/10 p-4">
                            <p className="text-sm font-mono text-destructive">
                                {error.message}
                            </p>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button onClick={reset} className="flex-1">
                            Intentar nuevamente
                        </Button>
                        <Button variant="outline" onClick={() => window.location.href = "/"} className="flex-1">
                            Ir al inicio
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
