import { SignUp } from '@clerk/nextjs'

export default async function SignUpPage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <SignUp />
    </div>
  )
}
