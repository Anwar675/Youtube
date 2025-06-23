import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { Button } from "./ui/button";

interface InfiniteScrollProps {
    isManual?: boolean;
    hasNextPage: boolean;
    isFetchingNextpage: boolean;
    fetchNextPage: () =>void
}

export const InfinitineSroll = ({isManual= false, hasNextPage,isFetchingNextpage,fetchNextPage}: InfiniteScrollProps) => {
    const {targetRef,isInterecting} = useIntersectionObserver({
        threshold:0.5,
        rootMargin:"100px"
    })
    useEffect(() => {
        if(isInterecting && hasNextPage && !isFetchingNextpage && !isManual) {
            fetchNextPage()
        }
    },[isInterecting, hasNextPage, fetchNextPage,isManual, isFetchingNextpage])
    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <div ref={targetRef} className="h-1" />
            {hasNextPage ? (
                <Button variant="secondary" disabled={!hasNextPage || isFetchingNextpage} onClick={() => fetchNextPage()}>
                    {isFetchingNextpage ? "Loading..": "Load More"}
                </Button>
            ): (
                <p className="text-xs text-white">You have reached the end of the list </p>
            )}
        </div>
    )
}