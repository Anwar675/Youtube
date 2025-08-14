"use client"

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { useAuth, useClerk } from "@clerk/nextjs"

import {  HistoryIcon, ListVideoIcon, ThumbsUpIcon,  } from "lucide-react"
import Link from "next/link"

const items = [
    {
        title:'History',
        url: '/playlist/history',
        icon: HistoryIcon,
        auth:true
    },
    {
        title:'Liked videos',
        url: '/playlist/liked',
        icon: ThumbsUpIcon,
        auth:true
    },
    {
        title:'All playlists',
        url: '/playlist',
        icon: ListVideoIcon,
        auth:true
    },
    
]

export const PersonalSection = () => {
    const clerk  = useClerk()
    const {isSignedIn} = useAuth()
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-lg text-white">
                You
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu className="flex gap-2">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton variant="hover" tooltip={item.title} asChild isActive={false} onClick={(e) => { 
                                if(!isSignedIn && item.auth) {
                                    e.preventDefault()
                                    return clerk.openSignIn()
                                }
                                
                            }}>
                                <Link href={item.url} className="flex text-white items-center py-5 gap-8">
                                    <item.icon size={32}/>
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>

        </SidebarGroup>
    )
}