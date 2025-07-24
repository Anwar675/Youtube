import { SidebarTrigger } from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { SearchInput } from "./search_input"
import { AuthButton } from "@/modules/auth/ui/components/auth_button"


export const HomeNavbar = () => {
    return (
        <div className="fixed top-0 left-0 right-0 h-16 bg-[#0f0f0f] flex items-center px-2 pr-5 z-50">
            <div className="flex sm:items-center justify-between gap-4 w-full">
                {/*  Menu and Logo  */}
                <div className="flex items-center shrink-0">

                    <SidebarTrigger />
                    <Link href='/'>
                        <div className="p-4 flex items-center gap-4">
                            <Image src='/logo.png' alt='Logo' width={32} height={32}/>
                            <p className="text-xl font-semibold tracking-tighter">Tayube</p>
                        </div>
                    </Link>
                </div>
                {/* Search bar */}
                <div className="flex-1 sm:flex hidden justify-center max-w-[720px] mx-auto">
                    <SearchInput />
                </div>
                <div className="flex  flex-end flex-shrink-0 items-center  gap-4">
                    <AuthButton />
                </div>
            </div>
        </div>
    )
}
