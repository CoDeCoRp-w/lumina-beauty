"use client";

import { Button } from "@/components/ui/button";
import { cancelAppointment } from "@/actions/admin";
import { Loader2 } from "lucide-react";
import { useState } from "react";


export function CancelButton({ id }: { id: string }) {
    const [isLoading, setIsLoading] = useState(false);
    // const { toast } = useToast(); // Assuming we have toaster, if not we use alert

    const handleCancel = async () => {
        if (!confirm("¿Estás seguro de cancelar esta cita?")) return;

        setIsLoading(true);
        const res = await cancelAppointment(id);
        setIsLoading(false);

        if (res.error) {
            alert(res.error);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancelar"}
        </Button>
    );
}
