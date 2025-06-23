import { SidebarTrigger } from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"

import { AuthButton } from "@/modules/auth/ui/components/auth_button"
import { StudioUploadModel } from "../studio-upload-modal"


export const StudioNabar = () => {
    return (
        <div className="fixed top-0 left-0 right-0 h-16 bg-[#0f0f0f] flex items-center px-2 pr-5 z-50 border-b shadow-gray-500 shadow-md">
            <div className="flex items-center gap-4 w-full">
                {/*  Menu and Logo  */}
                <div className="flex items-center shrink-0">

                    <SidebarTrigger />
                    <Link href='/studio'>
                        <div className="p-4 flex items-center gap-4">
                            <Image src='/logo.png' alt='Logo' width={32} height={32}/>
                            <p className="text-xl font-semibold tracking-tighter">Studio</p>
                        </div>
                    </Link>
                </div>
                {/* Search bar */}
                <div className="flex-1" />
                <div className="flex flex-end flex-shrink-0 items-center  gap-4">
                    <StudioUploadModel />
                    <AuthButton />
                </div>
            </div>
        </div>
    )
}
