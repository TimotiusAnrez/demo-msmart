'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthCTA() {
  return (
    <section className="my-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Connect with Local Farmers</h2>
        <p className="text-muted-foreground mb-6">
          Sign up to order fresh produce directly from local farmers, track your orders, and get
          personalized recommendations based on your preferences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/sign-up">Sign Up Free</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/sign-in">Log In</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
