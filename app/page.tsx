import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Placeholder */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-xl font-semibold tracking-tight">Lumina Beauty</h1>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Servicios</a>
          <a href="#" className="hover:text-primary transition-colors">Galería</a>
          <a href="#" className="hover:text-primary transition-colors">Equipo</a>
        </nav>
        <div className="flex gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary flex items-center">
            Iniciar Sesión
          </Link>
          <Link href="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
            Reservar Ahora
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-accent/10 -z-10" />

          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-6">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground">
              Experimenta el <span className="text-primary italic">Lujo</span> <br />
              Redefinido.
            </h2>
            <p className="max-w-[600px] text-muted-foreground text-lg md:text-xl">
              Eleva tu rutina de belleza con nuestros servicios premium.
              Reserva tu cita hoy y déjanos cuidar del resto.
            </p>
            <div className="flex gap-4 mt-8">
              <Link href="/login" className="flex items-center justify-center bg-primary text-primary-foreground h-12 px-8 rounded-full text-lg font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25">
                Reservar Cita
              </Link>
              <button className="bg-background border border-input h-12 px-8 rounded-full text-lg font-medium hover:bg-accent hover:text-accent-foreground transition-all">
                Ver Servicios
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border">
        © 2026 Lumina Beauty. Todos los derechos reservados.
      </footer>
    </div>
  );
}
