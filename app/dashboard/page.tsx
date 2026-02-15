import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Calendar, Activity } from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function DashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ingresos Totales (Mes)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Bs {stats.totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Este mes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Citas (Mes)</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.appointmentsCount}</div>
                        <p className="text-xs text-muted-foreground">Confirmadas este mes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{stats.newClientsCount}</div>
                        <p className="text-xs text-muted-foreground">Registrados este mes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Activos Ahora</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeNowCount}</div>
                        <p className="text-xs text-muted-foreground">Citas en curso</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Citas Recientes</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {stats.recentAppointments.length > 0 ? (
                            <div className="space-y-8">
                                {stats.recentAppointments.map((appt) => (
                                    <div key={appt.id} className="flex items-center">
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{appt.user.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {appt.service.name} - {format(appt.startDateTime, "PPP p", { locale: es })}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            +Bs {appt.service.price}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground text-center py-10">
                                No hay citas recientes.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Agenda de Hoy</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.todayAppointments.length > 0 ? (
                                stats.todayAppointments.map((appt) => (
                                    <div key={appt.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {appt.user.name ? appt.user.name.charAt(0).toUpperCase() : "C"}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{appt.user.name}</p>
                                                <p className="text-xs text-muted-foreground">{appt.service.name}</p>
                                                <p className="text-xs text-muted-foreground">Estilista: {appt.staff?.name || "Sin asignar"}</p>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium">
                                            {format(appt.startDateTime, "HH:mm")}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-muted-foreground text-center py-4">
                                    No hay citas para hoy.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
