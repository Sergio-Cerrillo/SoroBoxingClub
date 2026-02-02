"use client"

import { m, useScroll, useTransform } from "framer-motion"
import { useRef, type ReactNode } from "react"

/**
 * PARALLAX
 * 
 * Efecto parallax sutil basado en scroll.
 * Elementos se mueven a diferentes velocidades creando profundidad.
 * 
 * Uso:
 * <Parallax speed={0.5}>
 *   <Image ... />
 * </Parallax>
 * 
 * speed: 
 * - 0.5 = movimiento lento (fondo)
 * - 1 = velocidad normal
 * - 1.5 = movimiento rápido (primer plano)
 */

interface ParallaxProps {
    children: ReactNode
    speed?: number
    className?: string
    direction?: "vertical" | "horizontal"
}

export function Parallax({
    children,
    speed = 0.5,
    className = "",
    direction = "vertical",
}: ParallaxProps) {
    const ref = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    // Ajustar rango según velocidad
    const range = 100 * (1 - speed)

    const y = useTransform(
        scrollYProgress,
        [0, 1],
        direction === "vertical" ? [-range, range] : [0, 0]
    )

    const x = useTransform(
        scrollYProgress,
        [0, 1],
        direction === "horizontal" ? [-range, range] : [0, 0]
    )

    return (
        <m.div
            ref={ref}
            style={{
                y: direction === "vertical" ? y : undefined,
                x: direction === "horizontal" ? x : undefined,
            }}
            className={className}
        >
            {children}
        </m.div>
    )
}

/**
 * PARALLAX SCALE
 * 
 * Variante que escala al hacer scroll (zoom in/out)
 */

interface ParallaxScaleProps {
    children: ReactNode
    scale?: [number, number]
    className?: string
}

export function ParallaxScale({
    children,
    scale = [0.95, 1.05],
    className = "",
}: ParallaxScaleProps) {
    const ref = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    const scaleValue = useTransform(scrollYProgress, [0, 0.5, 1], [scale[0], 1, scale[1]])

    return (
        <m.div
            ref={ref}
            style={{ scale: scaleValue }}
            className={className}
        >
            {children}
        </m.div>
    )
}

/**
 * PARALLAX OPACITY
 * 
 * Fade in/out basado en scroll
 */

interface ParallaxOpacityProps {
    children: ReactNode
    range?: [number, number]
    className?: string
}

export function ParallaxOpacity({
    children,
    range = [0, 1],
    className = "",
}: ParallaxOpacityProps) {
    const ref = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [range[0], range[1], range[1], range[0]])

    return (
        <m.div
            ref={ref}
            style={{ opacity }}
            className={className}
        >
            {children}
        </m.div>
    )
}
