"use client"

import { Button } from "@/components/ui/button"
import { UserButton, SignedIn, SignInButton, SignedOut } from "@clerk/nextjs"
import { UserCircleIcon } from "lucide-react"

export const AuthButton = () => {
    return (
        <>
            <SignedIn>
                <UserButton />
            </SignedIn>
            <SignedOut>
                <SignInButton mode='modal'>
                    <Button variant="hover" className="rounded-full ">
                        <UserCircleIcon className="size-4" />
                        Sign In
                    </Button>
                </SignInButton>
            </SignedOut>
        </>
    )
}