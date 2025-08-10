"use client";

import { InfinitineSroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constans"
import { useIsMobile } from "@/hooks/use-mobile";
import { VideoGridCard } from "@/modules/videos/server/ui/components/video-grid-card";
import { VideoRowCard } from "@/modules/videos/server/ui/components/video-row-card";
import { trpc } from "@/trpc/client"


interface ResultsSectionProps {
    query: string | undefined
    categoryId: string | undefined
}

export const ResultsSection =({query, categoryId}: ResultsSectionProps) => {
    const isMobile = useIsMobile()
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
        {isMobile ? (
            <div className="flex flex-col gap-4 gap-y-10">
                {results.pages.flatMap((page) => page.items)
                .map((video) => (
                    <VideoGridCard key={video.id} data={video} />
                ))}
            </div>
        ): (
            <div className="flex flex-col gap-4">
                {results.pages.flatMap((page) => page.items)
                .map((video) => (
                    <VideoRowCard key={video.id} data={video} />
                ))}
            </div>
        )}
        <InfinitineSroll hasNextPage={resultQuery.hasNextPage}  isFetchingNextpage={resultQuery.isFetchingNextPage} fetchNextPage={resultQuery.fetchNextPage} />
       </>
    )
}