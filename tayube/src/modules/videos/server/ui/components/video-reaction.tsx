import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { VideoGetOneOutput } from "@/modules/videos/types"
import { trpc } from "@/trpc/client"
import { useClerk } from "@clerk/nextjs"
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { toast } from "sonner"


interface VideoReactionProps {
    videoId: string
    likes: number
    dislikes: number
    viewerReaction: VideoGetOneOutput["viewerReaction"]
}

export const VideoReactions = ({
    videoId,
    likes,
    dislikes,
    viewerReaction
}: VideoReactionProps) => {
   const clerk = useClerk()
   const utils = trpc.useUtils()
   const like = trpc.videoReactions.like.useMutation({
        onSuccess: () => {
            utils.videos.getOne.invalidate({id: videoId})
        },
        onError: (error) => {
            toast.error("Something Went Wrong")
            if(error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }
       
        }
   })
   
   const dislike = trpc.videoReactions.dislike.useMutation({
        onSuccess: () => {
            utils.videos.getOne.invalidate({id: videoId})
        },
        onError: (error) => {
            toast.error("Something Went Wrong")
            if(error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }
    
        }
   })
    return (
        <div className="flex items-center flex-none">
            <Button onClick={() => like.mutate({ videoId})} disabled={like.isPending || dislike.isPending} variant="new" className="rounded-l-full rounded-r-none gap-2 pr-4">
                <ThumbsUpIcon className={cn("size-5", viewerReaction === "like" && "fill-white")}/>
                {likes}
            </Button>
            <Separator orientation="vertical" className="h-7" />
            <Button variant="new" onClick={() => dislike.mutate({ videoId})} disabled={dislike.isPending || like.isPending} className="rounded-r-full rounded-l-none pl-3">
                <ThumbsDownIcon className={cn("size-5", viewerReaction === "dislike" && "fill-white")}/>
                {dislikes}
            </Button>
        </div>
    )
}