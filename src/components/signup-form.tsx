"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
})

type UserAuthFormValues = z.infer<typeof signupSchema>

interface SignupFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SignupForm({ className, ...props }: SignupFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const router = useRouter()
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm<UserAuthFormValues>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: UserAuthFormValues) {
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Authentication not configured",
        description: "Firebase is not configured. Please add your API keys.",
      });
      return;
    }
    setIsLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      router.push('/')
      toast({
        title: "Account created!",
        description: "You have successfully signed up.",
      })
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: error.message || "Your sign up request failed. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>
           <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("password")}
            />
             {errors?.password && (
              <p className="px-1 text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up with Email
          </Button>
        </div>
      </form>
    </div>
  )
}
