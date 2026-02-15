"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

export function ReportClientFilter({ stylists, currentStylist }: { stylists: any[], currentStylist: string }) {
    const router = useRouter();

    const handleFilterChange = (value: string) => {
        const params = new URLSearchParams();
        if (value && value !== "all") {
            params.set("stylist", value);
        }
        router.push(`/dashboard/reports?${params.toString()}`);
    };

    return (
        <div className="w-full sm:w-[200px]">
            <Select defaultValue={currentStylist} onValueChange={handleFilterChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Filtrar por Estilista" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los Estilistas</SelectItem>
                    {stylists.map((stylist) => (
                        <SelectItem key={stylist.id} value={stylist.id}>
                            {stylist.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
