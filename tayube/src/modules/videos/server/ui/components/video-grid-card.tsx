import { VideoGEtManyOutput } from "@/modules/videos/types";
import Link from "next/link";
import { VideoThhumbnail, VideoThumnailSkeleton } from "./videos-thumbnail";
import { VideoInfor, VideoInforSkeleton } from "./video-infor";


interface VideoGridCardProps {
    data: VideoGEtManyOutput["items"][number]
    onRemove?: () => void
}

export const VideoGridCardSkeleton = () => {
    return (
        <div className="flex flex-col gap-2 w-full ">
            <VideoThumnailSkeleton />
            <VideoInforSkeleton />
        </div>
    )
}

export const VideoGridCard = ({data, onRemove}: VideoGridCardProps) => {
    return (
        <div className="flex flex-col gap-2 w-full group ">
            <Link href={`/videos/${data.id}`}>
                <VideoThhumbnail imageUrl={data.thumbnailUrl} previewUrl={data.previewUrl} title={data.title} duration={data.duration}/>
            </Link>
            <VideoInfor data={data} onRemove={onRemove} />
        </div>
    )
}       