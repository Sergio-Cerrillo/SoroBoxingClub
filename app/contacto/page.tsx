"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Instagram, Clock, MessageCircle } from "lucide-react"

export default function ContactoPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <section className="pt-32 pb-12 bg-gradient-to-b from-primary to-primary/95">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 text-center">
                        <span className="text-accent">CONTÁCTANOS</span>
                    </h1>
                    <p className="text-lg text-primary-foreground/80 font-mono text-center max-w-2xl mx-auto">
                        Estamos aquí para ayudarte. Ponte en contacto con nosotros a través de cualquiera de estos canales.
                    </p>
                </div>
            </section>

            {/* Contact Info Section */}
            <section className="py-20 bg-black">
                <div className="container mx-auto px-4">
                    {/* Contact Cards Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {/* Teléfono */}
                        <Card className="p-8 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl hover:from-white/15 hover:via-white/10 hover:to-white/5 shadow-[0_20px_50px_rgba(251,191,36,0.15)] hover:shadow-[0_20px_70px_rgba(251,191,36,0.25)] transition-all duration-300 group rounded-[28px] border-0">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Phone className="w-8 h-8 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 font-mono">TELÉFONO</h3>
                                <p className="text-gray-400 mb-4 text-sm">Llámanos directamente</p>
                                <a
                                    href="tel:+34669102905"
                                    className="text-accent hover:text-accent/80 font-mono text-lg font-bold transition-colors"
                                >
                                    +34 669 102 905
                                </a>
                                <div className="mt-4 w-full">
                                    <Button
                                        asChild
                                        className="w-full bg-gradient-to-r from-amber-500/90 to-yellow-600/90 backdrop-blur-md border border-amber-400/30 text-accent-foreground hover:from-amber-500 hover:to-yellow-600 hover:border-amber-400/50 rounded-full shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <a href="tel:+34669102905">Llamar ahora</a>
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* WhatsApp */}
                        <Card className="p-8 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl hover:from-white/15 hover:via-white/10 hover:to-white/5 shadow-[0_20px_50px_rgba(251,191,36,0.15)] hover:shadow-[0_20px_70px_rgba(251,191,36,0.25)] transition-all duration-300 group rounded-[28px] border-0">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <MessageCircle className="w-8 h-8 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 font-mono">WHATSAPP</h3>
                                <p className="text-gray-400 mb-4 text-sm">Escríbenos por WhatsApp</p>
                                <a
                                    href="https://wa.me/34669102905"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent hover:text-accent/80 font-mono text-lg font-bold transition-colors"
                                >
                                    +34 669 102 905
                                </a>
                                <div className="mt-4 w-full">
                                    <Button
                                        asChild
                                        className="w-full bg-gradient-to-r from-amber-500/90 to-yellow-600/90 backdrop-blur-md border border-amber-400/30 text-accent-foreground hover:from-amber-500 hover:to-yellow-600 hover:border-amber-400/50 rounded-full shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <a href="https://wa.me/34669102905" target="_blank" rel="noopener noreferrer">
                                            Abrir WhatsApp
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Email */}
                        <Card className="p-8 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl hover:from-white/15 hover:via-white/10 hover:to-white/5 shadow-[0_20px_50px_rgba(251,191,36,0.15)] hover:shadow-[0_20px_70px_rgba(251,191,36,0.25)] transition-all duration-300 group rounded-[28px] border-0">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Mail className="w-8 h-8 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 font-mono">EMAIL</h3>
                                <p className="text-gray-400 mb-4 text-sm">Envíanos un correo</p>
                                <a
                                    href="mailto:soroboxingclubsta@gmail.com"
                                    className="text-accent hover:text-accent/80 font-mono text-sm font-bold transition-colors break-all"
                                >
                                    soroboxingclubsta@gmail.com
                                </a>
                                <div className="mt-4 w-full">
                                    <Button
                                        asChild
                                        className="w-full bg-gradient-to-r from-amber-500/90 to-yellow-600/90 backdrop-blur-md border border-amber-400/30 text-accent-foreground hover:from-amber-500 hover:to-yellow-600 hover:border-amber-400/50 rounded-full shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <a href="mailto:soroboxingclubsta@gmail.com">Enviar email</a>
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Instagram */}
                        <Card className="p-8 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl hover:from-white/15 hover:via-white/10 hover:to-white/5 shadow-[0_20px_50px_rgba(251,191,36,0.15)] hover:shadow-[0_20px_70px_rgba(251,191,36,0.25)] transition-all duration-300 group rounded-[28px] border-0">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Instagram className="w-8 h-8 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 font-mono">INSTAGRAM</h3>
                                <p className="text-gray-400 mb-4 text-sm">Síguenos en redes</p>
                                <a
                                    href="https://www.instagram.com/soroboxingclub/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent hover:text-accent/80 font-mono text-lg font-bold transition-colors"
                                >
                                    @soroboxingclub
                                </a>
                                <div className="mt-4 w-full">
                                    <Button
                                        asChild
                                        className="w-full bg-gradient-to-r from-amber-500/90 to-yellow-600/90 backdrop-blur-md border border-amber-400/30 text-accent-foreground hover:from-amber-500 hover:to-yellow-600 hover:border-amber-400/50 rounded-full shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <a href="https://www.instagram.com/soroboxingclub/" target="_blank" rel="noopener noreferrer">
                                            Visitar perfil
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Horarios */}
                        <Card className="p-8 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl hover:from-white/15 hover:via-white/10 hover:to-white/5 shadow-[0_20px_50px_rgba(251,191,36,0.15)] hover:shadow-[0_20px_70px_rgba(251,191,36,0.25)] transition-all duration-300 group rounded-[28px] border-0">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Clock className="w-8 h-8 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 font-mono">HORARIOS</h3>
                                <p className="text-gray-400 mb-4 text-sm">Abierto todo el año</p>
                                <div className="space-y-2 w-full">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400 font-mono text-sm">Lunes - Domingo</span>
                                        <span className="text-accent font-mono font-bold text-sm">09:00 - 21:00</span>
                                    </div>
                                    <div className="pt-2 mt-2 border-t border-accent/20">
                                        <p className="text-accent font-mono text-sm font-bold">
                                            ✓ Abierto 365 días al año
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Ubicación */}
                        <Card className="p-8 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl hover:from-white/15 hover:via-white/10 hover:to-white/5 shadow-[0_20px_50px_rgba(251,191,36,0.15)] hover:shadow-[0_20px_70px_rgba(251,191,36,0.25)] transition-all duration-300 group rounded-[28px] border-0">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <MapPin className="w-8 h-8 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 font-mono">UBICACIÓN</h3>
                                <p className="text-gray-400 mb-4 text-sm">Ven a visitarnos</p>
                                <p className="text-white font-mono text-sm mb-4">
                                    Carrer Casesnoves, 15<br />
                                    07320 Santa Maria del Camí<br />
                                    Illes Balears, España
                                </p>
                                <div className="mt-4 w-full">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md border border-amber-500/30 text-accent hover:from-white/30 hover:to-white/20 hover:border-amber-500/50 hover:bg-transparent rounded-full shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <a
                                            href="https://www.google.com/maps/search/?api=1&query=Carrer+Casesnoves+15+Santa+Maria+del+Camí"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Abrir en Maps
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Map Section */}
                    <Card className="p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-[0_20px_50px_rgba(251,191,36,0.15)] rounded-[28px] border-0">
                        <h2 className="text-2xl font-bold text-white mb-6 font-mono flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-accent" />
                            CÓMO LLEGAR
                        </h2>
                        <div className="rounded-[20px] overflow-hidden shadow-lg" style={{ height: '400px' }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3072.9446792584946!2d2.7475!3d39.6850!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1297912c0a7c7d9b%3A0x9c7c7c7c7c7c7c7c!2sCarrer%20Casesnoves%2C%2015%2C%2007320%20Santa%20Maria%20del%20Cam%C3%AD%2C%20Illes%20Balears!5e0!3m2!1ses!2ses!4v1600000000000!5m2!1ses!2ses"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </Card>

                    {/* CTA Section */}
                    <div className="mt-12 text-center">
                        <Card className="p-12 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-[0_20px_50px_rgba(251,191,36,0.15)] rounded-[28px] border-0">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-mono">
                                ¿LISTO PARA <span className="text-accent">EMPEZAR?</span>
                            </h2>
                            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                                Únete a nuestra comunidad de boxeo y transforma tu vida. Contáctanos hoy mismo para más información
                                sobre nuestras clases y planes.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    size="lg"
                                    asChild
                                    className="bg-gradient-to-r from-amber-500/90 to-yellow-600/90 backdrop-blur-md border border-amber-400/30 text-accent-foreground hover:from-amber-500 hover:to-yellow-600 hover:border-amber-400/50 text-lg px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
                                >
                                    <a href="https://wa.me/34669102905" target="_blank" rel="noopener noreferrer">
                                        Contactar por WhatsApp
                                    </a>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    asChild
                                    className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md border border-amber-500/30 text-accent hover:from-white/30 hover:to-white/20 hover:border-amber-500/50 hover:bg-transparent text-lg px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
                                >
                                    <a href="tel:+34669102905">
                                        Llamar ahora
                                    </a>
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
