import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import Link from "next/link";

import { DeleteStaffButton } from "./delete-staff-button";

export default async function StaffPage() {
    const staffMembers = await prisma.user.findMany({
        where: {
            role: { in: ["STAFF", "ADMIN"] }
        },
        orderBy: { name: "asc" },
        include: {
            // Include appointment count for validation before delete
            _count: {
                select: { staffAppointments: true }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Personal</h1>
                    <p className="text-muted-foreground">Gestiona a los estilistas y administradores.</p>
                </div>
                <Link href="/dashboard/staff/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Estilista
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listado de Personal</CardTitle>
                    <CardDescription>
                        Total: {staffMembers.length} miembros activos.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Citas Asignadas</TableHead>
                                <TableHead>Fecha Registro</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staffMembers.map((staff) => (
                                <TableRow key={staff.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {staff.name?.charAt(0).toUpperCase()}
                                            </div>
                                            {staff.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{staff.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={staff.role === "ADMIN" ? "default" : "secondary"}>
                                            {staff.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {staff._count.staffAppointments}
                                    </TableCell>
                                    <TableCell>
                                        {format(staff.createdAt, "dd MMM yyyy", { locale: es })}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DeleteStaffButton
                                            id={staff.id}
                                            name={staff.name}
                                            hasAppointments={staff._count.staffAppointments > 0}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}

                            {staffMembers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No hay personal registrado además de ti.
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
