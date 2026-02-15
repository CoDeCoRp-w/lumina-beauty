import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cancelAppointment } from "@/actions/admin";
import { CancelButton } from "./cancel-button";

export default async function AppointmentsPage() {
    const appointments = await prisma.appointment.findMany({
        include: {
            user: true, // Customer
            service: true,
            staff: true
        },
        orderBy: { startDateTime: "desc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Citas Programadas</h1>
                    <p className="text-muted-foreground">Gestiona las reservas y monitorea el estado de los pagos.</p>
                </div>
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block">
                <Card>
                    <CardHeader>
                        <CardTitle>Listado de Reservas</CardTitle>
                        <CardDescription>
                            Total: {appointments.length} citas registradas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Hora</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Servicio</TableHead>
                                    <TableHead>Especialista</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Monto</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {appointments.map((appt) => (
                                    <TableRow key={appt.id}>
                                        <TableCell className="font-medium">
                                            {format(appt.startDateTime, "dd MMM", { locale: es })}
                                        </TableCell>
                                        <TableCell>
                                            {format(appt.startDateTime, "HH:mm")}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{appt.user.name}</span>
                                                <span className="text-xs text-muted-foreground">{appt.user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{appt.service.name}</TableCell>
                                        <TableCell>
                                            {appt.staff ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                                                        {appt.staff.name?.charAt(0)}
                                                    </div>
                                                    <span>{appt.staff.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground italic">Sin asignar</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                appt.status === "CONFIRMED" ? "default" :
                                                    appt.status === "PENDING" ? "secondary" :
                                                        appt.status === "CANCELLED" ? "destructive" : "outline"
                                            }>
                                                {appt.status === "CONFIRMED" ? "Confirmado" :
                                                    appt.status === "PENDING" ? "Pendiente" :
                                                        appt.status === "CANCELLED" ? "Cancelado" : appt.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>Bs {appt.service.price}</TableCell>
                                        <TableCell className="text-right">
                                            {appt.status !== "CANCELLED" && (
                                                <CancelButton id={appt.id} />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {appointments.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                            No hay citas registradas.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Mobile View: Cards */}
            <div className="md:hidden space-y-4">
                {appointments.map((appt) => (
                    <Card key={appt.id} className="overflow-hidden">
                        <div className="flex items-center justify-between p-4 bg-muted/30 border-b">
                            <div className="flex flex-col">
                                <span className="font-bold text-lg">
                                    {format(appt.startDateTime, "dd 'de' MMMM", { locale: es })}
                                </span>
                                <span className="text-sm text-muted-foreground uppercase font-semibold tracking-wider">
                                    {format(appt.startDateTime, "HH:mm")}
                                </span>
                            </div>
                            <Badge variant={
                                appt.status === "CONFIRMED" ? "default" :
                                    appt.status === "PENDING" ? "secondary" :
                                        appt.status === "CANCELLED" ? "destructive" : "outline"
                            }>
                                {appt.status === "CONFIRMED" ? "Confirmado" : appt.status}
                            </Badge>
                        </div>
                        <CardContent className="p-4 space-y-4">
                            {/* Service Details */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-base">{appt.service.name}</h3>
                                    <p className="text-sm text-muted-foreground">Duración: {appt.service.duration} min</p>
                                </div>
                                <div className="font-bold text-lg">
                                    Bs {appt.service.price}
                                </div>
                            </div>

                            <hr />

                            {/* People */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground mb-1">Cliente</p>
                                    <div className="font-medium">{appt.user.name}</div>
                                </div>
                                <div>
                                    <p className="text-muted-foreground mb-1">Especialista</p>
                                    <div className="font-medium">
                                        {appt.staff ? appt.staff.name : "Sin asignar"}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            {appt.status !== "CANCELLED" && (
                                <div className="pt-2 flex justify-end">
                                    <CancelButton id={appt.id} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {appointments.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        No hay citas registradas.
                    </div>
                )}
            </div>
        </div>
    );
}
