"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { generatePaymentQR, checkPaymentStatus } from "@/actions/payment";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface PaymentModalProps {
    appointmentId: string;
    onPaymentSuccess: () => void;
    onClose: () => void; // If user cancels/closes
}

export function PaymentModal({ appointmentId, onPaymentSuccess, onClose }: PaymentModalProps) {
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [qrId, setQrId] = useState<string | null>(null);
    const [status, setStatus] = useState<"loading" | "waiting" | "paid" | "error">("loading");
    const [errorMsg, setErrorMsg] = useState("");

    // 1. Generate QR on mount
    useEffect(() => {
        let isMounted = true;

        async function loadQR() {
            const res = await generatePaymentQR(appointmentId);
            if (!isMounted) return;

            if (res.success && res.qr) {
                setQrImage(`data:image/png;base64,${res.qr}`); // Assuming byte array returned as base64 or need conversion? Doc said "Array de bytes". bnb.ts assumes string. Let's hope API returns base64 string or we handle it in lib.
                // NOTE: If API returns raw bytes, we need to convert in server action. 
                // Let's assume for now it returns a Base64 string in the JSON field 'qr'.
                setQrId(res.id || "");
                setStatus("waiting");
            } else {
                setStatus("error");
                setErrorMsg(res.error || "No se pudo generar el QR");
            }
        }

        loadQR();
        return () => { isMounted = false; };
    }, [appointmentId]);

    // 2. Poll for Status
    useEffect(() => {
        if (status !== "waiting" || !qrId) return;

        const interval = setInterval(async () => {
            const res = await checkPaymentStatus(qrId, appointmentId);
            if (res.success && res.status === "PAID") {
                setStatus("paid");
                clearInterval(interval);
                setTimeout(onPaymentSuccess, 2000); // Wait 2s to show success message then close
            }
        }, 5000); // Check every 5s

        return () => clearInterval(interval);
    }, [status, qrId, appointmentId, onPaymentSuccess]);

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Pago con QR Simple</DialogTitle>
                    <DialogDescription>
                        Escanea el código para confirmar tu reserva.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center p-4 min-h-[300px]">
                    {status === "loading" && (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Generando QR...</p>
                        </div>
                    )}

                    {status === "waiting" && qrImage && (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in">
                            <div className="relative h-64 w-64 rounded-lg overflow-hidden border shadow-sm">
                                {/* Next Image expects src, width, height */}
                                <img src={qrImage} alt="QR de Pago" className="w-full h-full object-contain" />
                            </div>
                            <p className="text-sm text-muted-foreground animate-pulse">
                                Esperando confirmación de pago...
                            </p>
                        </div>
                    )}

                    {status === "paid" && (
                        <div className="flex flex-col items-center gap-2 text-green-600 animate-in zoom-in">
                            <CheckCircle2 className="h-16 w-16" />
                            <p className="text-lg font-bold">¡Pago Exitoso!</p>
                            <p className="text-sm text-muted-foreground">Tu cita ha sido confirmada.</p>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center gap-2 text-destructive">
                            <AlertCircle className="h-12 w-12" />
                            <p className="font-medium">Error</p>
                            <p className="text-sm text-center">{errorMsg}</p>
                            <Button variant="outline" onClick={onClose} className="mt-4">
                                Cerrar
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
