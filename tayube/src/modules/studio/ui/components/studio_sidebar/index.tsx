"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"


import Link from "next/link"
import { LogOutIcon, VideoIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { StudioSidebarHeader } from "./studio-sidebar-header"




export const StudioSidbar = () => {
    const pathname = usePathname()
    return (
        <Sidebar className="border-none pt-[4rem]" collapsible="icon">
            <SidebarContent className="bg-[#0f0f0f]" >
                <SidebarGroup>
                    <SidebarMenu>
                        <StudioSidebarHeader />
                        <SidebarMenuItem>
                            <SidebarMenuButton isActive tooltip="Exit studio" asChild>
                                <Link href="/studio/videos">
                                    <VideoIcon className="size-5 text-white" />
                                    <span className="text-sm text-white ">Content</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        
                        <Separator />
                        <SidebarMenuItem>
                            <SidebarMenuButton className="hover:bg-[#282828]"  tooltip="Exit studio" asChild>
                                <Link href="/">
                                    <LogOutIcon className="size-5 text-white" />
                                    <span className="text-sm text-white ">Exit Studio</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                
            </SidebarContent>
        </Sidebar>

    )
}