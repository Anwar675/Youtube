import { VideoGEtManyOutput } from "@/modules/videos/types";
import Link from "next/link";
import { VideoThhumbnail } from "./videos-thumbnail";
import { VideoInfor } from "./video-infor";


interface VideoGridCardProps {
    data: VideoGEtManyOutput["items"][number]
    onRemove?: () => void
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