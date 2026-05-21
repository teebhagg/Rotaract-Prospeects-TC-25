import {Variants} from 'framer-motion'

const easeOutQuint = [0.23, 1, 0.32, 1]
const easeOutQuart = [0.25, 1, 0.5, 1]

export const fadeIn: Variants = {
  hidden: {opacity: 0},
  visible: {opacity: 1, transition: {duration: 0.6, ease: easeOutQuint}},
}

export const fadeInUp: Variants = {
  hidden: {opacity: 0, y: 20},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.6, ease: easeOutQuint},
  },
}

export const fadeInDown: Variants = {
  hidden: {opacity: 0, y: -20},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.6, ease: easeOutQuint},
  },
}

export const slideInLeft: Variants = {
  hidden: {opacity: 0, x: -30},
  visible: {
    opacity: 1,
    x: 0,
    transition: {duration: 0.7, ease: easeOutQuart},
  },
}

export const slideInRight: Variants = {
  hidden: {opacity: 0, x: 30},
  visible: {
    opacity: 1,
    x: 0,
    transition: {duration: 0.7, ease: easeOutQuart},
  },
}

export const scaleIn: Variants = {
  hidden: {opacity: 0, scale: 0.95},
  visible: {
    opacity: 1,
    scale: 1,
    transition: {duration: 0.6, ease: easeOutQuint},
  },
}

export const scrollReveal: Variants = {
  hidden: {opacity: 0, y: 30},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.7, ease: easeOutQuart},
  },
}

export const staggerContainer: Variants = {
  hidden: {opacity: 1},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
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
      ease: easeOutQuart,
    },
  },
}

export const orchestratedHero: Variants = {
  hidden: {opacity: 1},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

export const heroHeading: Variants = {
  hidden: {opacity: 0, y: 40},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.8, ease: easeOutQuint},
  },
}

export const heroSubheading: Variants = {
  hidden: {opacity: 0, y: 30},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.7, ease: easeOutQuint},
  },
}

export const heroCta: Variants = {
  hidden: {opacity: 0, y: 20},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.5, ease: easeOutQuint},
  },
}

export const heroImagery: Variants = {
  hidden: {opacity: 0, scale: 0.98},
  visible: {
    opacity: 1,
    scale: 1,
    transition: {duration: 1, ease: easeOutQuint},
  },
}

export const hoverLift: Variants = {
  rest: {scale: 1, transition: {duration: 0.3, ease: easeOutQuart}},
  hover: {
    scale: 1.02,
    transition: {duration: 0.3, ease: easeOutQuart},
  },
}

export const visibleItem: Variants = {
  hidden: {opacity: 1, y: 0},
  visible: {opacity: 1, y: 0},
}
