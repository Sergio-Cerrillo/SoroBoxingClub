"use client"

import { m, type Variants } from "framer-motion"
import { motionConfig, getTransition, getDistance } from "@/lib/motion/config"
import { type ReactNode } from "react"

/**
 * REVEAL COMPONENT
 * 
 * Wrapper genérico para animaciones de aparición.
 * Uso: <Reveal direction="up" delay={0.2}>{children}</Reveal>
 * 
 * Características:
 * - Direcciones: up, down, left, right, fade, scale
 * - Blur opcional para profundidad
 * - Stagger automático para listas
 * - Viewport trigger configurable
 */

type Direction = "up" | "down" | "left" | "right" | "fade" | "scale"

interface RevealProps {
    children: ReactNode
    direction?: Direction
    delay?: number
    duration?: keyof typeof motionConfig.duration
    blur?: boolean
    className?: string
    once?: boolean
    amount?: number
}

export function Reveal({
    children,
    direction = "up",
    delay = 0,
    duration = "normal",
    blur = true,
    className = "",
    once = true,
    amount = 0.2,
}: RevealProps) {
    const getVariants = (): Variants => {
        const distance = getDistance("medium")
        const blurValue = blur ? motionConfig.blur.medium : "0px"

        const variants: Record<Direction, Variants> = {
            up: {
                hidden: {
                    opacity: 0,
                    y: distance,
                    filter: `blur(${blurValue})`
                },
                visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)"
                },
            },
            down: {
                hidden: {
                    opacity: 0,
                    y: -distance,
                    filter: `blur(${blurValue})`
                },
                visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)"
                },
            },
            left: {
                hidden: {
                    opacity: 0,
                    x: -distance,
                    filter: `blur(${blurValue})`
                },
                visible: {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)"
                },
            },
            right: {
                hidden: {
                    opacity: 0,
                    x: distance,
                    filter: `blur(${blurValue})`
                },
                visible: {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)"
                },
            },
            fade: {
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
            },
            scale: {
                hidden: {
                    opacity: 0,
                    scale: 0.85
                },
                visible: {
                    opacity: 1,
                    scale: 1
                },
            },
        }

        return variants[direction]
    }

    return (
        <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{
                once,
                amount,
                margin: motionConfig.viewport.margin
            }}
            variants={getVariants()}
            transition={getTransition(duration, delay)}
            className={className}
        >
            {children}
        </m.div>
    )
}

/**
 * REVEAL WHEN VISIBLE
 * 
 * Variante que NO usa whileInView, para control manual
 */
interface RevealWhenVisibleProps extends RevealProps {
    isVisible: boolean
}

export function RevealWhenVisible({
    children,
    isVisible,
    direction = "up",
    duration = "normal",
    blur = true,
    className = "",
}: RevealWhenVisibleProps) {
    const getVariants = (): Variants => {
        const distance = getDistance("medium")
        const blurValue = blur ? motionConfig.blur.medium : "0px"

        const variants: Record<Direction, Variants> = {
            up: {
                hidden: { opacity: 0, y: distance, filter: `blur(${blurValue})` },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            },
            down: {
                hidden: { opacity: 0, y: -distance, filter: `blur(${blurValue})` },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            },
            left: {
                hidden: { opacity: 0, x: -distance, filter: `blur(${blurValue})` },
                visible: { opacity: 1, x: 0, filter: "blur(0px)" },
            },
            right: {
                hidden: { opacity: 0, x: distance, filter: `blur(${blurValue})` },
                visible: { opacity: 1, x: 0, filter: "blur(0px)" },
            },
            fade: {
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
            },
            scale: {
                hidden: { opacity: 0, scale: 0.85 },
                visible: { opacity: 1, scale: 1 },
            },
        }

        return variants[direction]
    }

    return (
        <m.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={getVariants()}
            transition={getTransition(duration)}
            className={className}
        >
            {children}
        </m.div>
    )
}
