import { VideoGetOneOutput } from "@/modules/videos/types";
import { VideoOwner } from "./video-owner";
import { VideoReactions } from "./video-reaction";
import { VideoMenu } from "./video-mennu";
import { VideoDescription } from "./video-description";
import { useMemo } from "react";
import { format, formatDistanceToNow } from "date-fns";

interface VideoTopRowProps {
    video: VideoGetOneOutput
}

export const VideoTopRow = ({video}: VideoTopRowProps) => {
    const compactViews = useMemo(() => {
        return Intl.NumberFormat("en", {
            notation: "compact"
        }).format(video.viewCount)
    }, [video.viewCount])
    const expandedViews = useMemo(() => {
        return Intl.NumberFormat("en", {
            notation: "standard"
        }).format(video.viewCount)
    }, [video.viewCount])
    const compactDate = useMemo(() => {
        return formatDistanceToNow(video.createAt, {addSuffix:true})
    }, [video.createAt])
    const expandedDate = useMemo(() => {
        return format(video.createAt, "d MMM yyyy")
    }, [video.createAt])
    return (
        <div className="flex flex-col gap-4 mt-4">
            <h1 className="text-xl font-semibold">{video.title}</h1>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 ">
                <VideoOwner user={video.user} videoId={video.id} />
                <div className="flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible pb-2 -mb-2 sm:pb-0 sm:mb-0 gap-2" >
                    <VideoReactions videoId={video.id} dislikes={video.dislikeCount} likes={video.likeCount} viewerReaction={video.viewerReaction}/>
                    <VideoMenu variant="new"  videoId={video.id}  onRemove={() => {}} />
                </div>
            </div>
            <VideoDescription compactViews={compactViews} expandedViews={expandedViews} compactDate={compactDate} expandedDate={expandedDate} description={video.description} />
        </div>
    )
}