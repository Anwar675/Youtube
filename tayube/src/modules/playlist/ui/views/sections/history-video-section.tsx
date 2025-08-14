'use client'
import { InfinitineSroll } from "@/components/infinite-scroll"
import { DEFAULT_LIMIT } from "@/constans"
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/server/ui/components/video-grid-card"
import { VideoRowCard, VideoRowCardSkeleton } from "@/modules/videos/server/ui/components/video-row-card"
import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"


export const HistoryVideosSection = () =>{
    return (
        <Suspense fallback={<HistoryVideosSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <HistoryVideosSectionSuspense  />
            </ErrorBoundary>
        </Suspense>
    )
}

const HistoryVideosSectionSkeleton = () => {
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

const HistoryVideosSectionSuspense = () => {
    const [videos, query] = trpc.playlist.getHistory.useSuspenseInfiniteQuery({
         limit:DEFAULT_LIMIT
    },
    {
        getNextPageParam: (lastPage: {
            nextCursor: { id: string; updateAt: Date } | null;
        }) => lastPage.nextCursor,
    })
    return (
        <div>
            <div className="flex flex-col gap-4 gap-y-5 md:hidden"> 
                {videos.pages.flatMap((page) => page.items).map((video) => (
                    <VideoGridCard key={video.id} data={video} />
                ))}
            </div>
            <div className="hidden flex-col gap-4 gap-y-5 md:flex"> 
                {videos.pages.flatMap((page) => page.items).map((video) => (
                    <VideoRowCard key={video.id} data={video} />
                ))}
            </div>
            <InfinitineSroll 
                hasNextPage={query.hasNextPage}  isFetchingNextpage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage}
            />
        </div>
    )
}