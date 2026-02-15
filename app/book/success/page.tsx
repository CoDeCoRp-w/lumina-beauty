import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">¡Reserva Confirmada!</h1>
            <p className="text-muted-foreground max-w-[600px] mb-8">
                Tu cita ha sido agendada exitosamente. Hemos enviado un correo electrónico con los detalles.
            </p>

            <div className="gap-4 flex">
                <Link href="/">
                    <Button variant="outline">Volver al Inicio</Button>
                </Link>
            </div>
        </div>
    );
}
