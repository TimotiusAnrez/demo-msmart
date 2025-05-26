'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ShoppingCart, Shirt, BellIcon as Ball, Coffee } from 'lucide-react'

const icons = [
  { component: '🥥', name: 'coconut' },
  { component: ShoppingCart, name: 'cart' },
  { component: Shirt, name: 'clothing' },
  { component: Ball, name: 'ball' },
  { component: Coffee, name: 'beverage' },
]

const loadingTexts = [
  'Preparing your tropical experience...',
  'Loading fresh coconuts...',
  'Setting up your shopping cart...',
  'Organizing your wardrobe...',
  'Getting the games ready...',
  'Brewing fresh beverages...',
  'Almost there...',
  'Just a moment more...',
]

export default function TropicalLoading() {
  const [currentIconIndex, setCurrentIconIndex] = useState(0)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  // Cycle through icons every 2 seconds
  useEffect(() => {
    const iconTimer = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % icons.length)
    }, 2000)

    return () => clearInterval(iconTimer)
  }, [])

  // Cycle through text every 1 second
  useEffect(() => {
    const textTimer = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length)
    }, 1000)

    return () => clearInterval(textTimer)
  }, [])

  // Simulate loading progress
  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer)
          return 100
        }
        return prev + 0.5
      })
    }, 100)

    return () => clearInterval(progressTimer)
  }, [])

  const currentIcon = icons[currentIconIndex]

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-12"
          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          Paradise Store
        </motion.h1>

        {/* Central Icon Animation */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIconIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="w-full h-full flex items-center justify-center"
              >
                {typeof currentIcon.component === 'string' ? (
                  <span className="text-6xl">{currentIcon.component}</span>
                ) : (
                  <currentIcon.component className="w-16 h-16 text-gray-700" strokeWidth={1.5} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Loader beneath icon */}
          <div className="w-48 mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Loading</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        {/* Animated Text */}
        <div className="h-8 overflow-hidden mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentTextIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="text-lg text-gray-600"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {loadingTexts[currentTextIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Subtle decorative elements */}
        <div className="flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-emerald-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Loading status indicators */}
        <div className="mt-8 flex justify-center space-x-2">
          {icons.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index === currentIconIndex ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
              animate={{
                scale: index === currentIconIndex ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
