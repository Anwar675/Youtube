import { Button } from "@/components/ui/button";
import { UserAvata } from "@/components/user-avatar";
import { users } from "@/db/schema";
import { SupscriptionButton } from "@/modules/supscriptions/ui/components/supscription-button";
import { UserInfor } from "@/modules/users/ui/components/user-infor";
import { VideoGetOneOutput } from "@/modules/videos/types";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

interface VideoOwnerProps {
    user: VideoGetOneOutput["user"]
    videoId: string
}

export const VideoOwner = ({user, videoId}: VideoOwnerProps) => {
    const {userId: clerkUserId} = useAuth()
    return (
        <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0"> 
            <Link href={`/users/${user.id}`}>
                <div className="flex items-center gap-3 min-w-0">
                    <UserAvata size="lgg"  imageUrl={user.imageUrl} name={user.name} />
                    <div>
                        <UserInfor size="lg" name={user.name} />
                        <span className="text-sm text-muted-foreground line-clamp-1">
                            {0} subcribers
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
                <SupscriptionButton onClick={() => {}} disabled={false} isSubcribled={false} className="flex-none" />
            )}
        </div>
    )
}