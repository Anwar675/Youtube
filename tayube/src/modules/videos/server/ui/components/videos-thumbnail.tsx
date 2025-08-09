import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration } from "@/lib/utils";
import { THUMNAIL_FALLBACK } from "@/modules/videos/constans";
import Image from "next/image"

interface VideoThumbnailProps {
    imageUrl?: string | null;
    title:string;
    previewUrl?: string| null;
    duration: number;

}

export const VideoThumnailSkeleton = () => {
    return (
        <div className="relative w-full overflow-hidden transition-all group-hover:rounded-none rounded-xl aspect-video">
            <Skeleton className="size-full" />
        </div>
    )
}


export const VideoThhumbnail = ({
    imageUrl,
    title,
    previewUrl,
    duration
}: VideoThumbnailProps) => {
   
    return (
        <div className="relative group ">
            <div className="relative w-full overflow-hidden rounded-xl aspect-video">
                <Image src={imageUrl ?? THUMNAIL_FALLBACK} alt={title} fill className="h-full w-full object-cover cursor-pointer group-hover:opacity-0"/>
                <Image unoptimized={!!previewUrl} src={previewUrl ?? THUMNAIL_FALLBACK} alt={title} fill className="h-full w-full opacity-0 object-cover cursor-pointer group-hover:opacity-100"/>
            </div>
            <div className="absolute bottom-2 right-2 px-1 py-0.5 rounde bg-black/80 text-white text-xs font-medium ">
                {formatDuration(duration)}
            </div>
        </div>
    )
}