"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteStaff } from "@/actions/staff";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteStaffButton({ id, name, hasAppointments }: { id: string, name: string | null, hasAppointments: boolean }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (hasAppointments) {
            alert("No puedes eliminar este usuario porque tiene citas asignadas.");
            return;
        }

        if (!confirm(`¿Estás seguro de eliminar a ${name || "este usuario"}?`)) {
            return;
        }

        setIsLoading(true);
        const res = await deleteStaff(id);
        setIsLoading(false);

        if (res.error) {
            alert(res.error);
        } else {
            // Success
            router.refresh();
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isLoading || hasAppointments}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title={hasAppointments ? "No se puede eliminar (tiene citas)" : "Eliminar usuario"}
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
    );
}
