"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    Scissors,
    BarChart3
} from "lucide-react";

interface SidebarNavProps {
    role?: string;
    onItemClick?: () => void;
}

const items = [
    {
        title: "Inicio",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Citas",
        href: "/dashboard/appointments",
        icon: Calendar,
    },
    {
        title: "Servicios",
        href: "/dashboard/services",
        icon: Scissors,
    },
    {
        title: "Personal",
        href: "/dashboard/staff",
        icon: Users,
    },
    {
        title: "Reportes",
        href: "/dashboard/reports",
        icon: BarChart3,
    },
    {
        title: "Configuración",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function SidebarNav({ role = "USER", onItemClick }: SidebarNavProps) {
    const pathname = usePathname();

    const filteredItems = items.filter(item => {
        // Services, Staff, Settings, Reports -> ADMIN only
        if (item.href.includes("/services") || item.href.includes("/staff") || item.href.includes("/settings") || item.href.includes("/reports")) {
            return role === "ADMIN";
        }
        return true;
    });

    return (
        <nav className="grid items-start px-4 text-sm font-medium">
            {filteredItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onItemClick}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                            isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-primary hover:bg-muted"
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        {item.title}
                    </Link>
                );
            })}
        </nav>
    );
}
