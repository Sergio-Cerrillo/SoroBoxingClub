"use client"

import { m } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Volume2, VolumeX } from "lucide-react"
import Link from "next/link"
import { Reveal, TextReveal, ParallaxOpacity } from "@/components/motion"
import { motionConfig } from "@/lib/motion/config"
import { useState, useRef, useEffect } from "react"

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function HeroSection() {
  const [isMuted, setIsMuted] = useState(true)
  const [player, setPlayer] = useState<any>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const [isApiReady, setIsApiReady] = useState(false)

  useEffect(() => {
    // Evitar duplicar el script
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      if (window.YT && window.YT.Player) {
        setIsApiReady(true)
      }
      return
    }

    // Cargar la API de YouTube
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.async = true
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // Configurar callback global
    window.onYouTubeIframeAPIReady = () => {
      setIsApiReady(true)
    }
  }, [])

  useEffect(() => {
    if (!isApiReady || !playerRef.current || player) return

    const newPlayer = new window.YT.Player(playerRef.current, {
      videoId: 'J_PQCSPZvWk',
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 0,
        loop: 1,
        playlist: 'J_PQCSPZvWk',
        modestbranding: 1,
        showinfo: 0,
        rel: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        playsinline: 1,
        enablejsapi: 1,
      },
      events: {
        onReady: (event: any) => {
          event.target.playVideo()
          event.target.mute()
        },
        onStateChange: (event: any) => {
          // Si el video se pausa, reanudarlo
          if (event.data === window.YT.PlayerState.PAUSED) {
            event.target.playVideo()
          }
          // Si el video termina, reiniciarlo
          if (event.data === window.YT.PlayerState.ENDED) {
            event.target.playVideo()
          }
        }
      }
    })
    setPlayer(newPlayer)
  }, [isApiReady, player])

  const toggleMute = () => {
    if (player && player.isMuted !== undefined) {
      const currentlyMuted = player.isMuted()
      if (currentlyMuted) {
        player.unMute()
        setIsMuted(false)
      } else {
        player.mute()
        setIsMuted(true)
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
      <ParallaxOpacity range={[0.3, 1]}>
        <div className="absolute inset-0 z-0">
          {/* YouTube video background */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div
              ref={playerRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60 scale-[1.5]"
              style={{
                width: '177.77777778vh',
                height: '56.25vw',
                minWidth: '100vw',
                minHeight: '100vh'
              }}
            />
          </div>
          {/* Degradado inferior a negro */}
          <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-transparent via-black/70 to-black z-10" />
        </div>
      </ParallaxOpacity>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 z-20 text-center pt-20">
        {/* Botón de sonido */}
        <m.button
          onClick={toggleMute}
          className="fixed top-24 right-8 z-50 p-4 rounded-full bg-accent/90 hover:bg-accent text-accent-foreground backdrop-blur-sm shadow-lg transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </m.button>

        <div className="max-w-6xl mx-auto">
          {/* Badge con reveal */}
          <Reveal direction="down" delay={0.1} duration="fast">
            <div className="inline-flex items-center px-6 py-3 backdrop-blur-md border border-accent/30 rounded-full mb-8">
              <span className="text-accent font-mono text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
                Aquí, hoy y ahora.
              </span>
            </div>
          </Reveal>

          {/* Main Heading con TextReveal word-by-word */}
          <h1 className="text-[clamp(1.25rem,5vw,4rem)] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-8 tracking-tight leading-tight">
            <span className="inline-block text-primary-foreground whitespace-nowrap">
              <TextReveal delay={0.2} staggerDelay={0.04}>
                ENTRENA COMO UN
              </TextReveal>
            </span>
            {" "}
            <span className="inline-block text-accent font-extrabold whitespace-nowrap">
              <TextReveal delay={0.5} staggerDelay={0.04}>
                CAMPEÓN
              </TextReveal>
            </span>
            <span className="block mt-2">
              <span className="inline-block text-primary-foreground whitespace-nowrap">
                <TextReveal delay={0.8} staggerDelay={0.04}>
                  PELEA COMO UNA
                </TextReveal>
              </span>
              {" "}
              <span className="inline-block text-accent font-extrabold whitespace-nowrap">
                <TextReveal delay={1.1} staggerDelay={0.04}>
                  LEYENDA
                </TextReveal>
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <Reveal direction="up" delay={1.4} duration="normal">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary-foreground/90 mb-12 font-medium max-w-4xl mx-auto leading-relaxed px-4">
              Descubre el arte del boxeo en Soro Boxing Club.
              <span className="block mt-2 text-accent/90">Fuerza, técnica y disciplina.</span>
            </p>
          </Reveal>

          {/* CTA Button con animación especial */}
          <Reveal direction="scale" delay={1.7} duration="normal">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-20 px-4">
              <Link href="/contacto" className="w-full sm:w-auto">
                <m.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={motionConfig.easing.spring}
                >
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500/90 to-yellow-600/90 backdrop-blur-md border border-amber-400/30 text-accent-foreground hover:from-amber-500 hover:to-yellow-600 hover:border-amber-400/50 text-base md:text-lg px-8 md:px-12 py-6 md:py-7 font-mono tracking-wider group shadow-[0_15px_40px_rgba(251,191,36,0.4)] hover:shadow-[0_20px_50px_rgba(251,191,36,0.5)] rounded-full transition-all"
                  >
                    Empecemos
                    <m.span
                      className="ml-3 inline-block"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ArrowRight size={20} />
                    </m.span>
                  </Button>
                </m.div>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Scroll Indicator con animación */}
      <Reveal direction="fade" delay={2} duration="slow">
        <m.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30"
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-7 h-12 border-2 border-accent/60 rounded-full flex items-start justify-center p-2 backdrop-blur-sm bg-primary/20">
            <m.div
              className="w-2 h-3 bg-accent rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </m.div>
      </Reveal>
    </section>
  )
}
