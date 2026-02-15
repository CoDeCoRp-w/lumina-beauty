import { getAvailableServices, getAvailableStaff } from "@/actions/booking";
import { BookingWizard } from "@/components/booking/booking-wizard";


// Force dynamic rendering to ensure we always get the latest service list
export const dynamic = "force-dynamic";

export default async function BookingPage() {
    const services = await getAvailableServices();
    const staffMembers = await getAvailableStaff();

    return (
        <div className="min-h-screen bg-muted/30 py-10 px-4 md:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Reserva tu Cita</h1>
                    <p className="text-muted-foreground">Sigue los pasos para agendar tu visita</p>
                </div>

                <BookingWizard services={services} staffMembers={staffMembers} />
            </div>
        </div>
    );
}
