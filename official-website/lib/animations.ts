import {Variants} from 'framer-motion'

export const fadeIn: Variants = {
  hidden: {opacity: 0},
  visible: {opacity: 1, transition: {duration: 0.5}},
}

export const fadeInUp: Variants = {
  hidden: {opacity: 0, y: 20},
  visible: {opacity: 1, y: 0, transition: {duration: 0.5}},
}

export const fadeInDown: Variants = {
  hidden: {opacity: 0, y: -20},
  visible: {opacity: 1, y: 0, transition: {duration: 0.5}},
}

export const slideInLeft: Variants = {
  hidden: {opacity: 0, x: -30},
  visible: {opacity: 1, x: 0, transition: {duration: 0.5}},
}

export const slideInRight: Variants = {
  hidden: {opacity: 0, x: 30},
  visible: {opacity: 1, x: 0, transition: {duration: 0.5}},
}

export const scaleIn: Variants = {
  hidden: {opacity: 0, scale: 0.9},
  visible: {opacity: 1, scale: 1, transition: {duration: 0.5}},
}

export const staggerContainer: Variants = {
  hidden: {opacity: 1},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
}

export const staggerItem: Variants = {
  hidden: {opacity: 0, y: 30},
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
}

// For immediate visibility (no animation delay)
export const visibleItem: Variants = {
  hidden: {opacity: 1, y: 0},
  visible: {opacity: 1, y: 0},
}

