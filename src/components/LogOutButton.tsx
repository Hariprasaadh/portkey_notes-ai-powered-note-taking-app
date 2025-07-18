'use client'

import React from 'react'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from "sonner" // Import toast for notifications
import { logOutAction } from '@/actions/users' // Import the logOutAction function

const LogOutButton = () => {
  
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  

  const handleLogOut = async () => {
    setLoading(true)

    const  { errorMessage } = await logOutAction();
    
    if(!errorMessage) {
        toast.success("Logged out successfully!")
        router.push('/login')
    } else{
        toast.error("Failed to log out. Please try again.")
        console.error("Logout error:", errorMessage)
    }
    setLoading(false)
  }

  return (
    <Button 
    onClick={handleLogOut}
    variant={'outline'} 
    className='w-24'
    disabled={loading}>
        {loading ? <Loader2 className='animate-spin'/> : "Log Out"}
    </Button>
  )
}

export default LogOutButton
