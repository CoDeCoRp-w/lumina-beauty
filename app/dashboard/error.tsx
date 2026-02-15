"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard error:", error);
    }, [error]);

    return (
        <div className="flex min-h-[50vh] items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-xl text-destructive">Error en el Dashboard</CardTitle>
                    <CardDescription>
                        No se pudo cargar esta página del dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {process.env.NODE_ENV === "development" && (
                        <div className="rounded-lg bg-destructive/10 p-3">
                            <p className="text-xs font-mono text-destructive">
                                {error.message}
                            </p>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button onClick={reset} size="sm" className="flex-1">
                            Reintentar
                        </Button>
                        <Button variant="outline" size="sm" asChild className="flex-1">
                            <Link href="/dashboard">Ir al Dashboard</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
