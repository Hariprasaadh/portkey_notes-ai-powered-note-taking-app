'use client'; 

import { useRouter } from "next/navigation"; 
import { toast } from "sonner";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { loginAction, signUpAction } from "@/actions/users"; // Importing the actions for login and sign-up

type Props = {
    type: "login" | "sign-up";
}

const AuthForm = ({ type }: Props) => { 

  const isLoginForm = type === "login";
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {

    // It allows to show a loading state while the form is being submitted.
    // It is used to handle the form submission in a non-blocking way.
    startTransition(async () => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      let errorMessage;
      if (isLoginForm) {
        errorMessage = (await loginAction(email, password)).errorMessage;
      } else {
        errorMessage = (await signUpAction(email, password)).errorMessage;
      }

      if (!errorMessage) {
        toast.success(
          isLoginForm ? "Logged in successfully!" : "Signed up successfully!",
          {
            description: "Redirecting to the Home Page...",
            duration: 2000,
          },
        );
        router.replace("/");
      } else {
        toast.error(errorMessage, {
          description: "Please try again.",
          duration: 5000,
        });
      }
    });
  }
 
  return (
    <form action={handleSubmit}>
        <CardContent className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
               <Label htmlFor="email"> Email</Label>
               <Input id="email" name="email" type="email" placeholder="Enter your email" required disabled={isPending}/>
            </div>

            <div className="flex flex-col space-y-1.5">
               <Label htmlFor="password"> Password</Label>
               <Input id="password" name="password" type="password" placeholder="Enter your password" required disabled={isPending}/>
            </div>

        </CardContent>

        <CardFooter className="mt-4 flex flex-col gap-6">
            <Button className="w-full ">
                {
                isPending ? 
                <Loader2 className="animate-spin" /> : 
                isLoginForm ? "Login" : "Sign Up"
                }
            </Button>
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    {isLoginForm ? "Don't have an account?" : "Already have an account?"}{" "}
                    <Link 
                    href={isLoginForm ? "/sign-up" : "/login"} 
                    className="font-medium text-primary hover:text-primary/80 hover:underline transition-colors duration-200"
                    >
                    {isLoginForm ? "Sign up" : "Sign in"}
                    </Link>
                </p>
            </div> 
        </CardFooter>

    </form>
  )
}

export default AuthForm