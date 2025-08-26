"use client"

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvata } from "@/components/user-avatar"
import { DEFAULT_LIMIT } from "@/constans"
import { trpc } from "@/trpc/client"
import {  ListIcon } from "lucide-react"


import Link from "next/link"
import { usePathname } from "next/navigation"

export const LoadingSkeleton = () => {
    return (
        <>
            {[1,2,3,4].map((i) => (
                <SidebarMenuItem key={i}>
                    <SidebarMenuButton disabled>
                        <Skeleton className="size-6 rounded-full shrink-0" />
                        <Skeleton className="h-4 w-full " />
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ) )}
        </>
    )
}

export const SubscriptionSection = () => {
   const pathname = usePathname()
   const {data,isLoading} = trpc.subscriptions.getMany.useInfiniteQuery({
        limit:DEFAULT_LIMIT
   }, {
        getNextPageParam: (lastPage: {
            nextCursor: { id: string; updateAt: Date } | null;
        }) => lastPage.nextCursor,
   })
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-lg text-white">
                Subscriptions
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu className="flex gap-2">
                    {isLoading && <LoadingSkeleton />}
                    {data?.pages.flatMap((page) => page.items).map((subscription) => (
                        <SidebarMenuItem key={`${subscription.creatorId}-${subscription.viewerId}`}>
                            <SidebarMenuButton variant="hover" tooltip={subscription.user.name} asChild isActive={pathname === `/users/${subscription.user.id}`}                                
                            >
                                <Link href={`/users/${subscription.user.id}`} className="flex text-white items-center py-5 gap-8">
                                    <UserAvata size='xs' imageUrl={subscription.user.imageUrl} name={subscription.user.name} />
                                    <span className="text-sm">{subscription.user.name}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                    {!isLoading && (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === "/subscriptions"}>
                                <Link href="/subscriptions" className="flex text-white items-center gap-4">
                                    <ListIcon className="size-4" />
                                    <span className="text-sm">All Subscription</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarGroupContent>

        </SidebarGroup>
    )
}