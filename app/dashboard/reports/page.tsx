import { getRevenueStats, getStylistsForFilter } from "@/actions/reports";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Filter } from "lucide-react";
import { redirect } from "next/navigation";
import { ReportClientFilter } from "./filter-client"; // We need a client component for interaction

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ stylist?: string }> }) {
    const { stylist } = await searchParams;
    const stylistId = stylist || "all";

    // Parallel fetching
    const [stats, stylists] = await Promise.all([
        getRevenueStats(stylistId),
        getStylistsForFilter()
    ]);

    if ("error" in stats) {
        return <div className="p-8 text-destructive">Error al cargar reportes.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reportes de Ingresos</h1>
                    <p className="text-muted-foreground">Vista detallada de ganancias y rendimiento.</p>
                </div>

                <ReportClientFilter stylists={stylists} currentStylist={stylistId} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales (Filtrado)</CardTitle>
                        <span className="text-muted-foreground font-bold">Bs</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Bs {stats.totalRevenue.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Citas Realizadas</CardTitle>
                        <Filter className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Desglose de Citas</CardTitle>
                    <CardDescription>
                        Historial de servicios que generan ingresos.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Servicio</TableHead>
                                <TableHead>Estilista</TableHead>
                                <TableHead className="text-right">Precio</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.appointments?.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell>
                                        {format(app.startDateTime, "dd MMM yyyy, HH:mm", { locale: es })}
                                    </TableCell>
                                    <TableCell>{app.user?.name || "Cliente"}</TableCell>
                                    <TableCell>{app.service.name}</TableCell>
                                    <TableCell>{app.staff?.name || "-"}</TableCell>
                                    <TableCell className="text-right font-medium">
                                        Bs {app.service.price}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {stats.appointments?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                        No se encontraron registros para este filtro.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
