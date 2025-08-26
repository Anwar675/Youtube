"use client"

import { DEFAULT_LIMIT } from "@/constans"
import { trpc } from "@/trpc/client"
import { VideoRowCard, VideoRowCardSkeleton } from "../components/video-row-card"
import { VideoGridCard, VideoGridCardSkeleton } from "../components/video-grid-card"
import { InfinitineSroll } from "@/components/infinite-scroll"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"



interface SuggestSectionProps {
    videoId: string;
    isManual?: boolean
}



export const SuggestSection = ({videoId,isManual}: SuggestSectionProps) => {
    return (
        <Suspense fallback={<SuggestSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <SuggestSectionSupspense videoId={videoId} isManual={isManual} />
            </ErrorBoundary>
        </Suspense>
    )
}

const SuggestSectionSkeleton = () => {
    return (
    <>
        <div className="hidden md:block space-y-3">
            {Array.from({length: 8}).map((_,index) => (
                <VideoRowCardSkeleton key={index} size="compact" />
            ))}
        </div>
        <div className="hidden md:block space-y-10">
            {Array.from({length: 8}).map((_,index) => (
                <VideoGridCardSkeleton key={index}  />
            ))}
        </div>
    </>)
}

const SuggestSectionSupspense = ({videoId,isManual}: SuggestSectionProps) => {
    const [suggestions, query] = trpc.suggestions.getMany.useSuspenseInfiniteQuery({
        videoId,
        limit: DEFAULT_LIMIT    
    }, {
        getNextPageParam: (lastPage: {
          nextCursor: { id: string; updateAt: Date } | null;
        }) => lastPage.nextCursor,
    })
    return (
        <>       
            <div className="hidden md:block space-y-3">
                {suggestions.pages.flatMap((page) => page.items.map((video) => (
                    <VideoRowCard key={video.id} data={video} size="compact" />
                ) ) )} 
            </div>
            <div className="block md:hidden space-y-10">
                {suggestions.pages.flatMap((page) => page.items.map((video) => (
                    <VideoGridCard key={video.id} data={video} />
                )))} 
            </div>  
            <InfinitineSroll hasNextPage={query.hasNextPage} isManual={isManual} isFetchingNextpage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage} />
        </>
    )
}