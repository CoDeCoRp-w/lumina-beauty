"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, User, Calendar as CalendarIcon, Clock, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { getAvailableSlots, createBooking } from "@/actions/booking";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { PaymentModal } from "@/components/booking/payment-modal";

interface Service {
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration: number;
}

interface Staff {
    id: string;
    name: string | null;
    role: string;
}

interface BookingWizardProps {
    services: Service[];
    staffMembers: Staff[];
}

export function BookingWizard({ services, staffMembers }: BookingWizardProps) {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState<string | null>(null);
    const [slots, setSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // New state for Step 4
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Payment State
    const [bookingId, setBookingId] = useState<string | null>(null);

    const handleDateSelect = async (newDate: Date | undefined) => {
        setDate(newDate);
        setTime(null);
        if (newDate && selectedStaff) {
            setIsLoadingSlots(true);
            const available = await getAvailableSlots(newDate, selectedStaff);
            setSlots(available);
            setIsLoadingSlots(false);
        }
    };

    const handleNext = () => {
        setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        console.log("Submit clicked. Data:", { selectedService, selectedStaff, date, time, clientName });

        if (!selectedService || !selectedStaff || !date || !time || !clientName || !clientEmail) {
            console.error("Missing fields in submit");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createBooking({
                serviceId: selectedService,
                staffId: selectedStaff,
                date: date,
                time: time,
                clientName,
                clientEmail
            });

            console.log("CreateBooking Result:", result);

            if (result.success && result.bookingId) {
                console.log("Setting Booking ID:", result.bookingId);
                // Instead of redirecting immediately, show payment modal
                setBookingId(result.bookingId);
            } else {
                console.error("Booking Error:", result.error);
                alert(result.error);
            }
        } catch (error) {
            console.error("Submit Exception:", error);
            alert("Error desconocido");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePaymentSuccess = () => {
        window.location.href = "/book/success";
    };

    const currentService = services.find(s => s.id === selectedService);
    const currentStaff = staffMembers.find(s => s.id === selectedStaff);

    if (bookingId) {
        return (
            <PaymentModal
                appointmentId={bookingId}
                onPaymentSuccess={handlePaymentSuccess}
                onClose={() => window.location.href = "/dashboard/appointments"}
            />
        );
    }

    return (
        <div className="space-y-8">
            {/* Progress Steps */}
            <div className="flex justify-center mb-8">
                <div className="flex items-center gap-2">
                    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2", step >= 1 ? "border-primary bg-primary text-primary-foreground" : "border-muted text-muted-foreground")}>1</div>
                    <div className={cn("h-1 w-12 rounded-full", step >= 2 ? "bg-primary" : "bg-muted")} />
                    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2", step >= 2 ? "border-primary bg-primary text-primary-foreground" : "border-muted text-muted-foreground")}>2</div>
                    <div className={cn("h-1 w-12 rounded-full", step >= 3 ? "bg-primary" : "bg-muted")} />
                    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2", step >= 3 ? "border-primary bg-primary text-primary-foreground" : "border-muted text-muted-foreground")}>3</div>
                    <div className={cn("h-1 w-12 rounded-full", step >= 4 ? "bg-primary" : "bg-muted")} />
                    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2", step >= 4 ? "border-primary bg-primary text-primary-foreground" : "border-muted text-muted-foreground")}>4</div>
                </div>
            </div>

            {/* Step 1: Services */}
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>1. Selecciona un Servicio</CardTitle>
                        <CardDescription>Elige el tratamiento que deseas</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                onClick={() => setSelectedService(service.id)}
                                className={cn(
                                    "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/50",
                                    selectedService === service.id ? "border-primary bg-primary/5" : "border-transparent bg-muted/20"
                                )}
                            >
                                <div>
                                    <div className="font-semibold">{service.name}</div>
                                    <div className="text-sm text-muted-foreground">{service.duration} min</div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="font-bold">Bs {service.price}</div>
                                    {selectedService === service.id && <Check className="h-5 w-5 text-primary" />}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Staff */}
            {step === 2 && (
                <Card>
                    <CardHeader>
                        <CardTitle>2. Selecciona un Especialista</CardTitle>
                        <CardDescription>¿Con quién te gustaría atenderte?</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-3">
                        <div
                            onClick={() => setSelectedStaff("any")}
                            className={cn(
                                "flex flex-col items-center justify-center p-6 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/50 gap-3",
                                selectedStaff === "any" ? "border-primary bg-primary/5" : "border-transparent bg-muted/20"
                            )}
                        >
                            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                                <User className="h-6 w-6 text-secondary-foreground" />
                            </div>
                            <div className="font-semibold">Cualquiera</div>
                            {selectedStaff === "any" && <Check className="h-5 w-5 text-primary absolute top-4 right-4" />}
                        </div>

                        {staffMembers.map((staff) => (
                            <div
                                key={staff.id}
                                onClick={() => setSelectedStaff(staff.id)}
                                className={cn(
                                    "flex flex-col items-center justify-center p-6 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/50 gap-3 relative",
                                    selectedStaff === staff.id ? "border-primary bg-primary/5" : "border-transparent bg-muted/20"
                                )}
                            >
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                    {staff.name?.charAt(0) || "S"}
                                </div>
                                <div className="font-semibold">{staff.name}</div>
                                {selectedStaff === staff.id && <Check className="h-5 w-5 text-primary absolute top-4 right-4" />}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
                <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>3. Elige la Fecha</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={handleDateSelect}
                                locale={es}
                                className="rounded-md border border-zinc-200 shadow"
                                disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Horarios Disponibles</CardTitle>
                            <CardDescription>
                                {date ? format(date, "EEEE d 'de' MMMM", { locale: es }) : "Selecciona una fecha primero"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!date && (
                                <div className="flex h-40 items-center justify-center text-muted-foreground text-sm">
                                    Selecciona un día en el calendario
                                </div>
                            )}

                            {date && isLoadingSlots && (
                                <div className="flex h-40 items-center justify-center text-muted-foreground">
                                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                    Buscando horarios...
                                </div>
                            )}

                            {date && !isLoadingSlots && slots.length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                    {slots.map((slot) => (
                                        <Button
                                            key={slot}
                                            variant={time === slot ? "default" : "outline"}
                                            onClick={() => setTime(slot)}
                                            className="text-sm"
                                        >
                                            {slot}
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Step 4: Client Details */}
            {step === 4 && (
                <Card>
                    <CardHeader>
                        <CardTitle>4. Tus Datos</CardTitle>
                        <CardDescription>Ingresa tu información para confirmar la cita</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Nombre Completo</label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="Tu nombre"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Correo Electrónico</label>
                            <input
                                type="email"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                placeholder="tu@email.com"
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                            />
                        </div>

                        <div className="pt-4 border-t mt-4">
                            <h4 className="font-semibold mb-2">Resumen</h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>Servicio: <span className="text-foreground">{currentService?.name}</span></p>
                                <p>Especialista: <span className="text-foreground">{currentStaff?.name || "Cualquiera"}</span></p>
                                <p>Fecha: <span className="text-foreground">{date && format(date, "PPP", { locale: es })}</span></p>
                                <p>Hora: <span className="text-foreground">{time}</span></p>
                                <p>Total: <span className="text-foreground font-bold">Bs {currentService?.price}</span></p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
                {step > 1 ? (
                    <Button variant="outline" onClick={handleBack} disabled={isSubmitting} className="gap-2">
                        <ChevronLeft className="h-4 w-4" /> Atrás
                    </Button>
                ) : (
                    <div /> /* Spacer */
                )}

                {step < 4 ? (
                    <Button
                        onClick={handleNext}
                        disabled={
                            (step === 1 && !selectedService) ||
                            (step === 2 && !selectedStaff) ||
                            (step === 3 && (!date || !time))
                        }
                        className="gap-2"
                    >
                        Siguiente <ChevronRight className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        disabled={!clientName || !clientEmail || isSubmitting}
                        className="gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Confirmando...
                            </>
                        ) : (
                            "Confirmar Reserva"
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}
