import { UserAvata } from "@/components/user-avatar";
import { UserGetOutput } from "../../types";
import { useAuth, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SupscriptionButton } from "@/modules/subscriptions/ui/components/supscription-button";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface UserPageInforProps {
    user: UserGetOutput
}

export const UserPageInforSkeleton =() => {
    return (
        <div className="py-6">
            <div className="flex flex-col md:hidden">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-[60px] w-[60px] rounded-full " />
                    <div className="flex-1 min-w-0">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-28 mt-1" />
                    </div>
                </div>
                <Skeleton  className="h-10 w-full mt-3 rounded-full" />
            </div>
            <div className="hidden md:flex items-center gap-4">
                <Skeleton className="h-[160px] w-[160px] rounded-full" />            
                <div className="flex-1 min-w-0">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-28 mt-1" />
                    <Skeleton  className="h-10 w-full mt-3 rounded-full" />
                </div>
                
            </div>
        </div>
    )
}

export const UserPageInfor = ({user}: UserPageInforProps) => {
    const {userId, isLoaded} = useAuth()
    const clerk = useClerk()
    const {isPending, onClick} = useSubscription({
        userId: user.id,
        isSubscribed: user.viewerSubscribled,
        
    })
    return (
        <div className="py-6">
            <div className="flex flex-col md:hidden">
                <div className="flex items-center cursor-pointer gap-3">
                   <UserAvata size="lgg" imageUrl={user.imageUrl} name={user.name} className="h-[60px] w-[60px]" onClick={() => {
                    if(user.clerkId === userId) {
                        clerk.openUserProfile()
                    }
                   }} />
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-xl font-bold">{user.name}</h1>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <span>{user.subcriberCount} subcribers</span>
                        <span>&bull;</span>
                        <span>{user.videoCount} videos</span>
                    </div>
                </div>
                {userId === user.clerkId ? (
                    <Button variant="new" asChild className="w-full mt-3 rounded-full ">
                        <Link href="/studio">
                        Go to studio
                        </Link>
                    </Button>
                ) : (
                    <SupscriptionButton disabled={isPending || !isLoaded} isSubcribled={ user.viewerSubscribled} onClick={onClick} className="w-full mt-3" />
                )}
            </div>
            <div className="hidden md:flex items-center gap-4">
                <UserAvata size="xl" imageUrl={user.imageUrl} name={user.name} className={cn(userId === user.clerkId && "cursor-pointer hover:opacity-80 transition-opacity duration-300 ")} onClick={() => {
                    if(user.clerkId === userId) {
                        clerk.openUserProfile()
                    }
                }} />
                <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-3">
                        <span>{user.subcriberCount} subcribers</span>
                        <span>&bull;</span>
                        <span>{user.videoCount} videos</span>
                    </div>
                    {userId === user.clerkId ? (
                        <Button variant="new" asChild className=" mt-3 rounded-full ">
                            <Link href="/studio">
                            Go to studio
                            </Link>
                        </Button>
                    ) : (
                        <SupscriptionButton disabled={isPending || !isLoaded} isSubcribled={ user.viewerSubscribled} onClick={onClick} className=" mt-3" />
                    )}
                </div>
            </div>
        </div>
    )
}