"use client"

import { DEFAULT_LIMIT } from "@/constans"
import { videos } from "@/db/schema"
import { trpc } from "@/trpc/client"
import { VideoRowCard } from "../components/video-row-card"


interface SuggestSectionProps {
    videoId: string
}


export const SuggestSection = ({videoId}: SuggestSectionProps) => {
    const [suggestions] = trpc.suggestions.getMany.useSuspenseInfiniteQuery({
        videoId,
        limit: DEFAULT_LIMIT    
    }, {
        getNextPageParam: (lastPage: {
          nextCursor: { id: string; updateAt: Date } | null;
        }) => lastPage.nextCursor,
    })
    return (
        <div>
            {suggestions.pages.flatMap((page) => page.items.map((video) => (
                <VideoRowCard key={video.id} data={video} size="default" />
            ) ) )} 
        </div>
    )
}