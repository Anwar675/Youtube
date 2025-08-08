import { UserAvata } from "@/components/user-avatar";
import { formatTime } from "@/lib/utils";
import { UserInfor } from "@/modules/users/ui/components/user-infor";
import { VideoGEtManyOutput } from "@/modules/videos/types";
import Link from "next/link";
import { useMemo } from "react";
import { VideoMenu } from "./video-mennu";

interface VideoInforProps {
    data: VideoGEtManyOutput["items"][number]
    onRemove?: () => void
}

export const VideoInfor = ({data, onRemove}: VideoInforProps) => {
    const compactViews = useMemo(() => {
        return Intl.NumberFormat("en", {
            notation: "compact"
        }).format(data.viewCount)
    },[data.viewCount])

   return (
     <div className="flex gap-3">
        <Link href={`/users/${data.user.id}`}>
            <UserAvata  imageUrl={data.user.imageUrl} name={data.user.name} />
        </Link>
        <div className="min-w-0 flex-1">
            <Link href={`/videos/${data.id}`} >
                <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words"> 
                    {data.title}
                </h3>
            </Link>
            <Link href={`/videos/${data.id}`} >
                <UserInfor  name={data.user.name} />  
            </Link>
            <Link href={`/videos/${data.id}`} >
                <p className="text-sm text-gray-600 line-clamp-1">
                    {compactViews} views . {formatTime(data.createAt)}
                </p>
            </Link>
        </div>
        <div className="flex-shrink-0">
            <VideoMenu videoId={data.id} onRemove={onRemove} />
        </div>
     </div>
   )
}