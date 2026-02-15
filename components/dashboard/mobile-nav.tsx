"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Scissors } from "lucide-react";
import Link from "next/link";
import { SidebarNav } from "./sidebar-nav";
import { LogoutButton } from "./logout-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MobileNav({ role = "USER" }: { role?: string }) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <Button variant="ghost" className="md:hidden" onClick={() => setOpen(true)}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
            </Button>

            {mounted && createPortal(
                <>
                    {/* Backdrop */}
                    {open && (
                        <div
                            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
                            onClick={() => setOpen(false)}
                        />
                    )}

                    {/* Drawer */}
                    <div className={cn(
                        "fixed inset-y-0 left-0 z-50 w-72 bg-background border-r shadow-lg transition-transform duration-300 ease-in-out md:hidden flex flex-col",
                        open ? "translate-x-0" : "-translate-x-full"
                    )}>
                        <div className="flex h-14 items-center border-b px-6 justify-between">
                            <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
                                <Scissors className="h-6 w-6 text-primary" />
                                <span>Lumina Salón</span>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-auto py-4">
                            <div className="px-4 mb-4">
                                <p className="text-sm text-muted-foreground mb-2">Menú</p>
                            </div>
                            <SidebarNav role={role} onItemClick={() => setOpen(false)} />
                        </div>

                        <div className="border-t p-4">
                            <LogoutButton />
                        </div>
                    </div>
                </>,
                document.body
            )}
        </>
    );
}
