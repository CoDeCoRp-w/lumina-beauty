import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteService } from "@/actions/services";

export default async function ServicesPage() {
    const services = await prisma.service.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Servicios</h1>
                <Link href="/dashboard/services/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Agregar Servicio
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                    <Card key={service.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">
                                {service.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Bs {service.price}</div>
                            <p className="text-xs text-muted-foreground">
                                {service.duration} minutos
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                {service.description}
                            </p>
                            <div className="mt-4 flex justify-end">
                                <form action={async () => {
                                    "use server"
                                    await deleteService(service.id)
                                }}>
                                    <Button variant="ghost" size="icon" type="submit" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {services.length === 0 && (
                    <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 text-muted-foreground">
                        <p className="mb-2">No se encontraron servicios</p>
                        <p className="text-sm">Crea tu primer servicio para comenzar</p>
                    </div>
                )}
            </div>
        </div>
    );
}
