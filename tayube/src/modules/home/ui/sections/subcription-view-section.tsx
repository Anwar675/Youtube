'use client'
import { InfinitineSroll } from "@/components/infinite-scroll"
import { DEFAULT_LIMIT } from "@/constans"
import { VideoGridCard, VideoGridCardSkeleton } from "@/modules/videos/server/ui/components/video-grid-card"
import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"


export const SubscriptionVideosSection = () =>{
    return (
        <Suspense fallback={<SubscriptionVideosSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <SubscriptionVideosSectionSuspense  />
            </ErrorBoundary>
        </Suspense>
    )
}

const SubscriptionVideosSectionSkeleton = () => {
    return (
        <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4  [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6"> 
            {Array.from({length:18}).map((_,index) => (
                <VideoGridCardSkeleton key={index}  />
            ))}
        </div>
    )
}

const SubscriptionVideosSectionSuspense = () => {
    const [videos, query] = trpc.videos.getManySubscriptions.useSuspenseInfiniteQuery({
         limit:DEFAULT_LIMIT
    },
    {
        getNextPageParam: (lastPage: {
            nextCursor: { id: string; updateAt: Date } | null;
        }) => lastPage.nextCursor,
    })
    return (
        <div>
            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4  [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6"> 
                {videos.pages.flatMap((page) => page.items).map((video) => (
                    <VideoGridCard key={video.id} data={video} />
                ))}
            </div>
            <InfinitineSroll 
                hasNextPage={query.hasNextPage}  isFetchingNextpage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage}
            />
        </div>
    )
}