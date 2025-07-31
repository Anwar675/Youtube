"use client"

import { InfinitineSroll } from "@/components/infinite-scroll"
import { DEFAULT_LIMIT } from "@/constans"
import { CommentForm } from "@/modules/comments/ui/components/comment-form"
import { CommentItems } from "@/modules/comments/ui/components/comment-item"
import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

 
interface CommentsSectionProps {
    videoId: string
}



export const CommentsSection = ({videoId}: CommentsSectionProps) => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <CommentsSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    )
}

export const CommentsSectionSuspense = ({videoId}: CommentsSectionProps) => {
    const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery({
        videoId,
        limit:DEFAULT_LIMIT
    }, {   
        getNextPageParam: (lastPage: {
            nextCursor: { id: string; updateAt: Date } | null;
        }) => lastPage.nextCursor,
    })
    return (
        <div className="mt-6">
            <div className="flex flex-col gap-6">
                <h1 className="text-xl font-bold"> {comments.pages[0].items[0].totalCount} Comments</h1>
                <CommentForm  videoId={videoId}/>
            </div>
            <div className="flex flex-col gap-4 mt-2">
                {comments.pages.flatMap((page) => page.items).map((comment) => (
                    <CommentItems key={comment.id} comment={comment} />
                ))}
                <InfinitineSroll 
                    isManual
                    hasNextPage={query.hasNextPage}
                    isFetchingNextpage={query.isFetchingNextPage}
                    fetchNextPage={query.fetchNextPage}
                />
            </div>
        </div>
    )
}