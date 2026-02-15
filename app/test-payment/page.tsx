"use client";

import { PaymentModal } from "@/components/booking/payment-modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createTestAppointment } from "@/actions/debug";

export default function TestPaymentPage() {
    const [showModal, setShowModal] = useState(false);
    const [appointmentId, setAppointmentId] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const startTest = async () => {
        setLoading(true);
        const res = await createTestAppointment();
        setLoading(false);
        if (res.success && res.appointmentId) {
            setAppointmentId(res.appointmentId);
            setShowModal(true);
        } else {
            alert("Error creating test appointment: " + res.error);
        }
    };

    return (
        <div className="p-10 flex flex-col items-center justify-center gap-10">
            <h1 className="text-2xl font-bold">Test Payment Flow (Real Data)</h1>
            <Button onClick={startTest} disabled={loading}>
                {loading ? "Creating Appointment..." : "Create Test Appointment & Pay"}
            </Button>

            {showModal && appointmentId && (
                <PaymentModal
                    appointmentId={appointmentId}
                    onPaymentSuccess={() => alert("Payment Verified! Success!")}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
