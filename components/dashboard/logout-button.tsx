"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/actions/auth";

export function LogoutButton() {
    return (
        <button
            onClick={() => logout()}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
        >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
        </button>
    );
}
