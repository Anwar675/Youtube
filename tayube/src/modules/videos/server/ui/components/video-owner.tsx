import { Button } from "@/components/ui/button";
import { UserAvata } from "@/components/user-avatar";
import { useSubscription } from "@/modules/subscriptions/hooks/use-subscription";


import { SupscriptionButton } from "@/modules/subscriptions/ui/components/supscription-button";
import { UserInfor } from "@/modules/users/ui/components/user-infor";
import { VideoGetOneOutput } from "@/modules/videos/types";
import { useAuth } from "@clerk/nextjs";

import Link from "next/link";

interface VideoOwnerProps {
    user: VideoGetOneOutput["user"]
    videoId: string
}
 
export const VideoOwner = ({user, videoId}: VideoOwnerProps) => {
    console.log(user.subcriberCount)
    const {userId: clerkUserId} = useAuth()
    const {isPending, onClick} = useSubscription({
        userId: user.id,
        isSubscribed: user.viewerSubscribed,
        fromVideoId: videoId
    })
    return (
        <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0"> 
            <Link href={`/users/${user.id}`}>
                <div className="flex items-center gap-3 min-w-0">
                    <UserAvata size="lgg"  imageUrl={user.imageUrl} name={user.name} />
                    <div>
                        <UserInfor size="lg" name={user.name} />
                        <span className="text-sm text-muted-foreground line-clamp-1">
                            {user.subcriberCount} subcribers
                        </span>
                    </div>
                </div>
            </Link>
            {clerkUserId === user.clerkId ? (
                <Button variant="new" className="rounded-full" asChild  >
                    <Link href={`/studio/videos/${videoId}`}>
                        Edit video
                    </Link>
                </Button>
            ): (
                <SupscriptionButton onClick={onClick} disabled={isPending} isSubcribled={user.viewerSubscribed} className="flex-none" />
            )}
        </div>
    )
}