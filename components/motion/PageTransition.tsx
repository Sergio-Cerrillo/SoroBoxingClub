"use client"

import { m, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { motionConfig } from "@/lib/motion/config"

/**
 * PAGE TRANSITION
 * 
 * Transición elegante al cambiar de página.
 * Usar en layout.tsx para animar cambios de ruta.
 * 
 * Características:
 * - Fade + slide sutil
 * - No bloquea la navegación
 * - Respeta prefers-reduced-motion
 */

interface PageTransitionProps {
    children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname()

    return (
        <AnimatePresence mode="wait" initial={false}>
            <m.div
                key={pathname}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={{
                    initial: {
                        opacity: 0,
                        y: 20,
                    },
                    animate: {
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: motionConfig.duration.fast,
                            ease: motionConfig.easing.easeOut,
                        },
                    },
                    exit: {
                        opacity: 0,
                        y: -10,
                        transition: {
                            duration: motionConfig.duration.fast / 2,
                            ease: motionConfig.easing.easeOut,
                        },
                    },
                }}
            >
                {children}
            </m.div>
        </AnimatePresence>
    )
}

/**
 * FADE TRANSITION
 * 
 * Transición simple fade (más rápida)
 */

export function FadeTransition({ children }: PageTransitionProps) {
    const pathname = usePathname()

    return (
        <AnimatePresence mode="wait">
            <m.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {children}
            </m.div>
        </AnimatePresence>
    )
}
