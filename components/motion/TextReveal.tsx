"use client"

import { m } from "framer-motion"
import { motionConfig } from "@/lib/motion/config"
import { type ReactNode } from "react"

/**
 * TEXT REVEAL
 * 
 * Anima texto word-by-word con efecto de máscara.
 * Ideal para títulos y hero sections.
 * 
 * Uso:
 * <TextReveal>
 *   ENTRENA COMO UN CAMPEÓN
 * </TextReveal>
 */

interface TextRevealProps {
    children: string
    delay?: number
    className?: string
    staggerDelay?: number
}

export function TextReveal({
    children,
    delay = 0,
    className = "",
    staggerDelay = 0.03,
}: TextRevealProps) {
    const words = children.split(" ")

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

    const word = {
        hidden: {
            opacity: 0,
            y: 50,
            rotateX: -90,
            filter: "blur(8px)",
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.6,
                ease: motionConfig.easing.textReveal,
            },
        },
    }

    return (
        <m.span
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{
                once: true,
                amount: 0.3,
            }}
            className={`inline-block ${className}`}
            style={{ perspective: "1000px" }}
        >
            {words.map((wordText, index) => (
                <span key={index} className="inline-block overflow-hidden mr-2">
                    <m.span
                        variants={word}
                        className="inline-block"
                        style={{ transformOrigin: "bottom" }}
                    >
                        {wordText}
                    </m.span>
                </span>
            ))}
        </m.span>
    )
}

/**
 * TEXT REVEAL CHAR
 * 
 * Variante letra por letra (más dramático, usar con moderación)
 */

interface TextRevealCharProps {
    children: string
    delay?: number
    className?: string
}

export function TextRevealChar({
    children,
    delay = 0,
    className = "",
}: TextRevealCharProps) {
    const chars = children.split("")

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: delay,
                staggerChildren: 0.02,
            },
        },
    }

    const charVariant = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
            },
        },
    }

    return (
        <m.span
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className={className}
        >
            {chars.map((character, index) => (
                <m.span key={index} variants={charVariant} className="inline-block">
                    {character === " " ? "\u00A0" : character}
                </m.span>
            ))}
        </m.span>
    )
}

/**
 * CLIP TEXT REVEAL
 * 
 * Revela texto con efecto de clip-path (máscara deslizante)
 */

interface ClipTextRevealProps {
    children: ReactNode
    delay?: number
    className?: string
}

export function ClipTextReveal({
    children,
    delay = 0,
    className = "",
}: ClipTextRevealProps) {
    return (
        <m.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
                duration: 1.2,
                delay,
                ease: motionConfig.easing.easeOut,
            }}
            className={className}
        >
            {children}
        </m.div>
    )
}
