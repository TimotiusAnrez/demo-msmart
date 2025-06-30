'use client'

import React from 'react'
import { motion } from 'framer-motion'

const spinTransition = {
  repeat: Infinity,
  ease: 'linear' as const,
  duration: 1,
}

export const Spinner = () => {
  return (
    <div className="relative h-12 w-12">
      <motion.span
        className="absolute left-0 top-0 block h-12 w-12 rounded-full border-[7px] border-neutral-100 border-t-neutral-800 box-border"
        animate={{ rotate: 360 }}
        transition={spinTransition}
      />
    </div>
  )
}
