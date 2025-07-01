import { shadow } from "@/styles/utils"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button";
import DarkModeToggle from "@/components/DarkModeToggle"
import LogOutButton from "@/components/LogOutButton";
// import { getUser } from "@/auth/server";

 function  Header ()  {

  const user = 1;
  
  return (
    <header
      className="relative flex h-24 w-full items-center justify-between bg-popover px-3 sm:px-8"
      style={{ boxShadow: shadow }}
    >
      <Link className="flex items-end gap-2" href="/">
        <Image
          src="/icon.webp"
          alt="PortKey Notes Logo"
          width={60}
          height={60}
          className="rounded-full mt-3 ml-3"
          priority
        />

        <h1 className="flex flex-col pb-2 text-2xl font-semibold leading-6">
          <span>PortKey</span>
          <span>Notes</span>
        </h1>
      </Link>

      <div className="flex gap-4">
        {user ? (
          <LogOutButton />
        ) : (
          <>
            <Button asChild>
              <Link href="/sign-up" className="hidden sm:block">
                Sign Up
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
        <DarkModeToggle />
      </div>  
    </header>
  )
}

export default Header