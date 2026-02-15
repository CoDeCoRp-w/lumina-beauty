import Link from "next/link"
import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    LogOut,
    Scissors
} from "lucide-react"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { LogoutButton } from "@/components/dashboard/logout-button"
import { getSession } from "@/lib/auth"
import { MobileNav } from "@/components/dashboard/mobile-nav"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession();
    const role = session?.role || "USER";

    return (
        <div className="flex h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r border-zinc-200 bg-card md:flex">
                <div className="flex h-14 items-center border-b border-zinc-200 px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Scissors className="h-6 w-6 text-primary" />
                        <span>Lumina Salón</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <SidebarNav role={role} />
                </div>
                <div className="border-t p-4">
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                <header className="flex h-14 items-center gap-4 border-b border-zinc-200 bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="md:hidden">
                        <MobileNav role={role} />
                    </div>
                    <div className="w-full flex-1">
                        <span className="font-medium">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                            A
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/20 relative">
                    {children}
                </main>
            </div>
        </div>
    )
}
