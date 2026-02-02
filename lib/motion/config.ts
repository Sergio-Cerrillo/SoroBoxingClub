/**
 * SORO BOXING CLUB - Motion Configuration
 * 
 * Control central de todas las animaciones del sitio.
 * Ajusta estos valores para cambiar la intensidad global.
 */

export const motionConfig = {
  // ============================================
  // INTENSIDAD GLOBAL (0-1)
  // Ajusta esto para aumentar/reducir todas las animaciones
  // ============================================
  intensity: 0.85, // 0.5 = suave, 1 = máximo impacto

  // ============================================
  // DURACIONES (segundos)
  // ============================================
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 0.9,
    verySlow: 1.2,
  },

  // ============================================
  // EASING (curvas de animación)
  // Cinematográfico = inicio suave, fin potente
  // ============================================
  easing: {
    // Para apariciones/desapariciones
    easeOut: [0.19, 1.0, 0.22, 1.0] as [number, number, number, number], // Suave al final
    easeInOut: [0.65, 0, 0.35, 1] as [number, number, number, number], // Suave en ambos extremos
    
    // Para elementos "punchy" (botones, cards)
    spring: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
      mass: 0.8,
    },
    
    // Para texto revelándose
    textReveal: [0.33, 1, 0.68, 1] as [number, number, number, number],
  },

  // ============================================
  // DISTANCIAS DE MOVIMIENTO
  // ============================================
  distance: {
    small: 20,
    medium: 40,
    large: 60,
    huge: 100,
  },

  // ============================================
  // BLUR (para efectos de profundidad)
  // ============================================
  blur: {
    light: "4px",
    medium: "8px",
    heavy: "12px",
  },

  // ============================================
  // STAGGER (retraso entre elementos)
  // ============================================
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15,
  },

  // ============================================
  // VIEWPORT SETTINGS
  // Cuánto debe estar visible para activar
  // ============================================
  viewport: {
    once: true, // Animar solo una vez
    amount: 0.2, // 20% visible para activar
    margin: "-50px", // Activar 50px antes de entrar
  },

  // ============================================
  // VARIANTES PREDEFINIDAS
  // ============================================
  variants: {
    // Fade simple
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },

    // Slide desde abajo (hero, títulos)
    slideUp: {
      hidden: { 
        opacity: 0, 
        y: 60, 
        filter: "blur(8px)" 
      },
      visible: { 
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)" 
      },
    },

    // Slide desde arriba (navbar)
    slideDown: {
      hidden: { 
        opacity: 0, 
        y: -60 
      },
      visible: { 
        opacity: 1, 
        y: 0 
      },
    },

    // Slide lateral (cards, servicios)
    slideLeft: {
      hidden: { 
        opacity: 0, 
        x: 60, 
        filter: "blur(6px)" 
      },
      visible: { 
        opacity: 1, 
        x: 0, 
        filter: "blur(0px)" 
      },
    },

    slideRight: {
      hidden: { 
        opacity: 0, 
        x: -60, 
        filter: "blur(6px)" 
      },
      visible: { 
        opacity: 1, 
        x: 0, 
        filter: "blur(0px)" 
      },
    },

    // Scale (botones, iconos)
    scale: {
      hidden: { 
        opacity: 0, 
        scale: 0.8 
      },
      visible: { 
        opacity: 1, 
        scale: 1 
      },
    },

    // Para texto revelándose
    textMask: {
      hidden: { 
        y: "100%", 
        opacity: 0 
      },
      visible: { 
        y: 0, 
        opacity: 1 
      },
    },
  },

  // ============================================
  // TRANSICIONES DE PÁGINA
  // ============================================
  pageTransition: {
    initial: { 
      opacity: 0, 
      y: 20 
    },
    animate: { 
      opacity: 1, 
      y: 0 
    },
    exit: { 
      opacity: 0, 
      y: -20 
    },
  },
}

/**
 * Helper: Obtener duración ajustada por intensidad
 */
export const getDuration = (speed: keyof typeof motionConfig.duration) => {
  return motionConfig.duration[speed] / motionConfig.intensity
}

/**
 * Helper: Obtener distancia ajustada por intensidad
 */
export const getDistance = (size: keyof typeof motionConfig.distance) => {
  return motionConfig.distance[size] * motionConfig.intensity
}

/**
 * Helper: Verificar si el usuario prefiere reducir movimiento
 */
export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Helper: Obtener transición ajustada
 */
export const getTransition = (
  duration: keyof typeof motionConfig.duration = 'normal',
  delay = 0
) => {
  return {
    duration: getDuration(duration),
    delay: delay * motionConfig.intensity,
    ease: motionConfig.easing.easeOut,
  }
}
