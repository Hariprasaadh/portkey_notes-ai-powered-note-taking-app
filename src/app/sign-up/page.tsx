import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import AuthForm from "@/components/AuthForm"

const page = () => {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-center text-3xl font-bold tracking-tight">
            Create Account
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Enter your details to create your account
          </p>
        </CardHeader>
        
        <CardContent className="pb-6">
          <AuthForm type="sign-up" />
        </CardContent>
      </Card>
    </div>
  )
}

export default page