"use client"

import { Button } from "@/components/ui/button"
import { UserButton, SignedIn, SignInButton, SignedOut } from "@clerk/nextjs"
import { ClapperboardIcon, UserCircleIcon, UserIcon } from "lucide-react"

export const AuthButton = () => {
    return (
        <>
            <SignedIn>
                <UserButton>
                    <UserButton.MenuItems>
                        <UserButton.Link label="My profile" href='/users/current' labelIcon={<UserIcon className="size-4" />} />
                        <UserButton.Link label="Studio" href='/studio' labelIcon={<ClapperboardIcon className="size-4" />} />
                        <UserButton.Action label="manageAccount" />
                    </UserButton.MenuItems>
                </UserButton>
            </SignedIn>
            <SignedOut>
                <SignInButton mode='modal' >
                    <Button variant="new" className="rounded-ful">
                        <UserCircleIcon className="size-4" />
                        Sign In
                    </Button>
                </SignInButton>
            </SignedOut>
        </>
    )
}