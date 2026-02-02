"use client"

import { LazyMotion, domAnimation, MotionConfig } from "framer-motion"
import { motionConfig, shouldReduceMotion } from "@/lib/motion/config"

/**
 * MOTION PROVIDER
 * 
 * Wrapper global para optimizar Framer Motion:
 * - LazyMotion: carga bajo demanda (reduce bundle)
 * - MotionConfig: configuración global
 * - Respeta prefers-reduced-motion automáticamente
 */

interface MotionProviderProps {
    children: React.ReactNode
}

export function MotionProvider({ children }: MotionProviderProps) {
    const reducedMotion = shouldReduceMotion()

    return (
        <LazyMotion features={domAnimation} strict>
            <MotionConfig
                reducedMotion={reducedMotion ? "always" : "never"}
                transition={motionConfig.easing.spring}
            >
                {children}
            </MotionConfig>
        </LazyMotion>
    )
}
