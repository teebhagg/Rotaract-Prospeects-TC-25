'use client'

import {motion, Variants} from 'framer-motion'
import {ReactNode} from 'react'
import {cn} from '@/lib/utils'

interface AnimatedDivProps {
  children: ReactNode
  variants?: Variants
  initial?: string
  animate?: string
  transition?: {delay?: number}
  className?: string
}

export function AnimatedDiv({
  children,
  variants,
  initial = 'hidden',
  animate,
  transition,
  className,
}: AnimatedDivProps) {
  return (
    <motion.div
      initial={initial}
      animate="visible"
      whileInView="visible"
      viewport={{once: true, margin: "-50px"}}
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

