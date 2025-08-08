"use client"

import { DEFAULT_LIMIT } from "@/constans"
import { videos } from "@/db/schema"
import { trpc } from "@/trpc/client"
import { VideoRowCard } from "../components/video-row-card"
import { VideoGridCard } from "../components/video-grid-card"
import { InfinitineSroll } from "@/components/infinite-scroll"


interface SuggestSectionProps {
    videoId: string;
    isManual?: boolean
}


export const SuggestSection = ({videoId,isManual}: SuggestSectionProps) => {
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