import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthCTA() {
  return (
    <section className="mt-16 mb-8 bg-slate-50 rounded-lg p-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Sign Up & Order Now</h2>
        <p className="text-muted-foreground mb-6">
          Create an account to place orders, track your purchases, and get personalized
          recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sign-in">
            <Button variant="outline" className="min-w-[120px]">
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="min-w-[120px] bg-indigo-600 hover:bg-indigo-700">
              Join Now <span className="ml-2">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
