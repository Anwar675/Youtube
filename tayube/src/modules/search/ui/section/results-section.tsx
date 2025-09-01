"use client";

import { InfinitineSroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constans"
import { VideoGridCard } from "@/modules/videos/server/ui/components/video-grid-card";
import { VideoRowCard, VideoRowCardSkeleton } from "@/modules/videos/server/ui/components/video-row-card";
import { trpc } from "@/trpc/client"
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


interface ResultsSectionProps {
    query: string | undefined
    categoryId: string | undefined
}


export const ResultsSection= (props: ResultsSectionProps) => {
    return (
        <Suspense key={`${props.query}-${props.categoryId}`} fallback={<ResultsSectionSkeleton />} >
            <ErrorBoundary fallback={<p>Error...</p>}>
                <ResultsSectionSuspense {...props} />
            </ErrorBoundary>
        </Suspense>
    )
}


const ResultsSectionSkeleton = () => {
    return (
        <div>
            <div className="hidden flex-col gap-4 md:flex">
                {Array.from({length: 5}).map((_,index) => (
                    <VideoRowCardSkeleton key={index} />
                ))}
            </div>
            <div className="flex flex-col gap-4 p-4 gap-y-10 pt-6 md:hidden">

            </div>
        </div>
    )
}

const ResultsSectionSuspense =({query, categoryId}: ResultsSectionProps) => {
    const [results,resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery({
        query,
        categoryId,
        limit: DEFAULT_LIMIT
    },
    {
        getNextPageParam: (lastPage: {
            nextCursor: { id: string; updateAt: Date } | null;
        }) => lastPage.nextCursor,
    })
    
    return (
       <>
       
        <div className="flex flex-col gap-4 gap-y-10 md:hidden">
            {results.pages.flatMap((page) => page.items)
            .map((video) => (
                <VideoGridCard key={video.id} data={video} />
            ))}
        </div>
        <div className="hidden flex-col gap-4 md:flex">
            {results.pages.flatMap((page) => page.items)
            .map((video) => (
                <VideoRowCard key={video.id} data={video} />
            ))}
        </div>
       
        <InfinitineSroll hasNextPage={resultQuery.hasNextPage}  isFetchingNextpage={resultQuery.isFetchingNextPage} fetchNextPage={resultQuery.fetchNextPage} />
       </>
    )
}