import { SidebarHeader, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { UserAvata } from "@/components/user-avatar"
import { useUser } from "@clerk/nextjs"
import Link from "next/link"

export const StudioSidebarHeader = () => {
    const {user} = useUser()
    const {state } = useSidebar()
    if(!user) {
        return (
            <SidebarHeader className="flex items-center justify-center pb-4">
                <Skeleton className="size-[112px] rounded-full"/>
                <div className="flex flex-col items-center mt-2 gap-y-1">
                    <Skeleton className="h-4 w-[80px]"/>
                    <Skeleton className="h-4 w-[100px]"/>
                </div>
            </SidebarHeader>
        )
    }

    if(state  === "collapsed") {
        return (
            
            <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-[#282828]"  tooltip="Exit studio" asChild>
                    <div className="flex justify-center items-center">
                        <Link href="/users/current">
                            <UserAvata imageUrl={user?.imageUrl} name={user.fullName ?? "Users"} size="sm"/> 
                            
                        </Link>
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }
    return (
        <SidebarHeader className="flex items-center justify-center pb-4">
            <Link href='/users/current'>
                <UserAvata  imageUrl={user?.imageUrl}  name={user?.fullName ?? "User"} className="size-[112px] hover:opacity-80 transition-opacity " />
            </Link> 
            <div className="flex flex-col items-center mt-2">
                <p className="text-white text-sm font-medium">
                    Your Profile
                </p>
                <p className="text-gray-500">
                    {user.fullName}
                </p>
            </div>
        </SidebarHeader>
    )
}