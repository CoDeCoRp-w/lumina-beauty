import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Store } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
                <p className="text-muted-foreground">Administra los datos de tu negocio y horarios de atención.</p>
            </div>

            <div className="grid gap-6">
                {/* Company Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Store className="h-5 w-5 text-primary" />
                            <CardTitle>Datos de la Empresa</CardTitle>
                        </div>
                        <CardDescription>Información general de tu salón.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre del Salón</Label>
                            <Input id="name" defaultValue="Lumina Salón" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Dirección</Label>
                            <Input id="address" placeholder="Calle Ejemplo 123" />
                        </div>
                        <div className="flex justify-end">
                            <Button>Guardar Cambios</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Business Hours (Placeholder) */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            <CardTitle>Horarios de Atención</CardTitle>
                        </div>
                        <CardDescription>Define los días y horas en los que aceptas citas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            Próximamente: Configuración avanzada de horarios y días festivos.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
