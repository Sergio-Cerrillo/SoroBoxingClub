"use client"

import { m } from "framer-motion"
import { motionConfig, getTransition } from "@/lib/motion/config"
import { type ReactNode } from "react"

/**
 * STAGGER CONTAINER
 * 
 * Anima hijos en cascada (uno tras otro).
 * Uso: 
 * <Stagger>
 *   <Card />
 *   <Card />
 *   <Card />
 * </Stagger>
 * 
 * Cada hijo se animará con un pequeño retraso.
 */

interface StaggerProps {
    children: ReactNode
    delay?: number
    staggerDelay?: number
    className?: string
    direction?: "up" | "down" | "left" | "right" | "scale"
}

export function Stagger({
    children,
    delay = 0,
    staggerDelay = motionConfig.stagger.normal,
    className = "",
    direction = "up",
}: StaggerProps) {
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: delay,
                staggerChildren: staggerDelay,
            },
        },
    }

    return (
        <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{
                once: motionConfig.viewport.once,
                amount: 0.1,
                margin: motionConfig.viewport.margin,
            }}
            variants={container}
            className={className}
        >
            {children}
        </m.div>
    )
}

/**
 * STAGGER ITEM
 * 
 * Hijo directo de Stagger.
 * Uso: 
 * <Stagger>
 *   <StaggerItem><Card /></StaggerItem>
 *   <StaggerItem><Card /></StaggerItem>
 * </Stagger>
 */

interface StaggerItemProps {
    children: ReactNode
    className?: string
    direction?: "up" | "down" | "left" | "right" | "scale" | "fade"
}

export function StaggerItem({
    children,
    className = "",
    direction = "up",
}: StaggerItemProps) {
    const getItemVariants = () => {
        const distance = 40

        const variants = {
            up: {
                hidden: { opacity: 0, y: distance, filter: "blur(6px)" },
                visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: getTransition("normal"),
                },
            },
            down: {
                hidden: { opacity: 0, y: -distance, filter: "blur(6px)" },
                visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: getTransition("normal"),
                },
            },
            left: {
                hidden: { opacity: 0, x: -distance, filter: "blur(6px)" },
                visible: {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                    transition: getTransition("normal"),
                },
            },
            right: {
                hidden: { opacity: 0, x: distance, filter: "blur(6px)" },
                visible: {
                    opacity: 1,
                    x: 0,
                    filter: "blur(0px)",
                    transition: getTransition("normal"),
                },
            },
            scale: {
                hidden: { opacity: 0, scale: 0.8 },
                visible: {
                    opacity: 1,
                    scale: 1,
                    transition: getTransition("normal"),
                },
            },
            fade: {
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: getTransition("fast"),
                },
            },
        }

        return variants[direction]
    }

    return (
        <m.div variants={getItemVariants()} className={className}>
            {children}
        </m.div>
    )
}
