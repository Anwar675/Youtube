import { VideoGEtManyOutput } from "@/modules/videos/types";
import { cva, VariantProps } from "class-variance-authority";
import Link from "next/link";
import { VideoThhumbnail } from "./videos-thumbnail";
import { cn, formatTime } from "@/lib/utils";
import { UserAvata } from "@/components/user-avatar";
import { UserInfor } from "@/modules/users/ui/components/user-infor";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { VideoMenu } from "./video-mennu";
import { useMemo } from "react";


const VideoRowCardVariants = cva("group flex min-w-0", {
    variants: {
        size: {
            default: "gap-4",
            compact: "gap-2"
        }
    },
    defaultVariants: {
        size:"default"
    }
})

const thumbnailVariants = cva("relative flex-none", {
    variants: {
        size: {
            default: "w-[38%]",
            compact: "w-[165px]"
        },
    },
    defaultVariants: {
        size:"default"
    }
})

interface VideoRowCardProps extends VariantProps<typeof VideoRowCardVariants> {
    data: VideoGEtManyOutput["items"][number]
    onRemove?: () => void 
}

export const VideoRowCardSkeleton = () => {
    return (
        <div>
            Skeleton
        </div>
    )
}

export const VideoRowCard = ({data, size, onRemove}: VideoRowCardProps) => {
    const compactViews = useMemo(() => {
        return Intl.NumberFormat("en", {
            notation: "compact"
        }).format(data.viewCount)
    },[data.viewCount])
    
    return (
        <div className={VideoRowCardVariants({size})}>
            <Link href={`/videos/${data.id}`} className={thumbnailVariants({size})}>
                <VideoThhumbnail imageUrl={data.thumbnailUrl} previewUrl={data.previewUrl} title={data.title} duration={data.duration} />
            </Link>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-x-2">
                    <Link href={`/videos/${data.id}`} className="flex-1 min-w-0">
                        <h3 className={cn("font-medium line-clamp-2", size === "compact" ? "text-sm": "text-base")}>
                            {data.title}
                        </h3>
                        {size === "default" && (
                            <p className="text-xs text-muted-foreground">
                                {data.viewCount} views ·  {formatTime(data.createAt)} trước
                            </p>
                        )}
                        {size === "default" && (
                            <>  
                                <div className="flex items-center gap-2 my-3">
                                    <UserAvata size="sm" imageUrl={data.user.imageUrl} name={data.user.name} />
                                    <UserInfor size="sm" name={data.user.name}/>
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <p className="text-xs text-muted-foreground">
                                            {data.description ?? "No descriptions"}
                                        </p>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" align="center">
                                        <p className="">From the video descriptions</p>
                                    </TooltipContent>
                                </Tooltip>
                            </>
                        )}
                        {size === "compact" && (
                            <UserInfor size="sm" name={data.user.name} />
                        )}
                        {size === "compact" && (
                            <p className="text-xs text-muted-foreground mt-1">
                                 {compactViews} views ·  {formatTime(data.createAt)} trước
                            </p>
                        )}
                    </Link>
                    <div className="lex-none">
                        <VideoMenu videoId={data.id} onRemove={onRemove} />
                    </div>
                </div>
            </div>
        </div>  
    )
}