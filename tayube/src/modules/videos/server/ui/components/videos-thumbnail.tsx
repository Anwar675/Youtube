import Image from "next/image"

export const VideoThhumbnail = () => {
    return (
        <div className="relative">
            <div className="relative w-full overflow-hidden rounded-xl aspect-video">
                <Image src="/placeholer.jpeg" alt="Thumnail " fill className="h-full w-full object-cover cursor-pointer "/>
            </div>
        </div>
    )
}