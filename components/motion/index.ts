/**
 * MOTION COMPONENTS - Index
 * 
 * Exportaciones centralizadas para fácil importación
 */

export { MotionProvider } from "./MotionProvider"
export { Reveal, RevealWhenVisible } from "./Reveal"
export { Stagger, StaggerItem } from "./Stagger"
export { TextReveal, TextRevealChar, ClipTextReveal } from "./TextReveal"
export { Parallax, ParallaxScale, ParallaxOpacity } from "./Parallax"
export { PageTransition, FadeTransition } from "./PageTransition"

// Re-export motion config para conveniencia
export { motionConfig, getDuration, getDistance, getTransition } from "@/lib/motion/config"
