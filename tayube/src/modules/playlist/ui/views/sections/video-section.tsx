'use client'
import { InfinitineSroll } from "@/components/infinite-scroll"
import { DEFAULT_LIMIT } from "@/constans"
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/server/ui/components/video-grid-card"
import { VideoRowCard, VideoRowCardSkeleton } from "@/modules/videos/server/ui/components/video-row-card"
import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { toast } from "sonner"

interface VideoSectionProps {
    playlistId: string
}
export const VideosSection = (props: VideoSectionProps) =>{
    return (
        <Suspense fallback={<VideosSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <VideosSectionSuspense {...props} />
            </ErrorBoundary>
        </Suspense>
    )
}

const VideosSectionSkeleton = () => {
    return (
        <div>
            <div className="flex flex-col gap-4 gap-y-5 md:hidden"> 
                {Array.from({length:18}).map((_,index) => (
                    <VideoGridCardSkeleton key={index}  />
                ))}
            </div>
            <div className="flex flex-col gap-4 gap-y-5 md:hidden"> 
                {Array.from({length:18}).map((_,index) => (
                    <VideoRowCardSkeleton key={index} size="compact"  />
                ))}
            </div>
            
        </div>
    ) 
}

const VideosSectionSuspense = ({playlistId}: VideoSectionProps) => {
    const [videos, query] = trpc.playlist.getVideos.useSuspenseInfiniteQuery({
            playlistId,
           limit:DEFAULT_LIMIT
    },
    {
        getNextPageParam: (lastPage: {
            nextCursor: { id: string; updateAt: Date } | null;
        }) => lastPage.nextCursor,
    })
    const utils = trpc.useUtils()
    const removeVideo = trpc.playlist.removeVideo.useMutation({
        onSuccess: (data) => {
            toast.success("video remove from playlist")
            utils.playlist.getMany.invalidate()
            utils.playlist.getManyForVideo.invalidate({videoId: data.videoId})
            utils.playlist.getOne.invalidate({id: data.playlistId})
            utils.playlist.getVideos.invalidate({playlistId: data.playlistId})
        },
        onError: () => {
            toast.error("something went wrong ")
        }
    })

    return (
        <div>
            <div className="flex flex-col gap-4 gap-y-5 md:hidden"> 
                {videos.pages.flatMap((page) => page.items).map((video) => (
                    <VideoGridCard key={video.id} data={video} onRemove={() => removeVideo.mutate({playlistId, videoId:video.id})} />
                ))}
            </div>
            <div className="hidden flex-col gap-4 gap-y-5 md:flex"> 
                {videos.pages.flatMap((page) => page.items).map((video) => (
                    <VideoRowCard key={video.id} data={video} onRemove={() => removeVideo.mutate({playlistId, videoId:video.id})} />
                ))}
            </div>
            <InfinitineSroll 
                hasNextPage={query.hasNextPage}  isFetchingNextpage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage}
            />
        </div>
    )
}