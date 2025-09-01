"use client"

import { InfinitineSroll } from "@/components/infinite-scroll"
import { Separator } from "@/components/ui/separator"
import { DEFAULT_LIMIT } from "@/constans"
import { CommentForm } from "@/modules/comments/ui/components/comment-form"
import { CommentItems } from "@/modules/comments/ui/components/comment-item"
import { trpc } from "@/trpc/client"
import { Loader2Icon, ShieldCloseIcon } from "lucide-react"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

 
interface CommentsSectionShortProps {
    videoId: string
    onClose?: () => void
}



export const CommentsSectionShort = ({videoId, onClose}: CommentsSectionShortProps) => {
    return (
        <Suspense fallback={<CommentSkeleton />}>
            <ErrorBoundary fallback={<p>Error</p>}>
                <CommentsSectionShortSuspense videoId={videoId} onClose={onClose} />
            </ErrorBoundary>
        </Suspense>
    )
}

const CommentSkeleton = () => {
    return (
        <div className="mt-6 flex justify-center items-center">
            <Loader2Icon className="text-muted-foreground size-7 animate-spin" />
        </div>
    )
}

export const CommentsSectionShortSuspense = ({videoId, onClose}: CommentsSectionShortProps) => {
    const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery({
        videoId,
        limit:DEFAULT_LIMIT
    }, {   
        getNextPageParam: (lastPage: {
            nextCursor: { id: string; updateAt: Date } | null;
        }) => lastPage.nextCursor,
    })
    return (
        <div className="mt-6 border border-gray-500 p-4 rounded-sm">
            <div className="flex justify-between">
                <h1 className="text-xl font-bold"> {comments.pages[0].totalCount} Comments</h1>
                <ShieldCloseIcon className="cursor-pointer"   onClick={onClose}/>
            </div>
            <div className="flex flex-col gap-4 mt-5">
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
            <div className="flex flex-col gap-6">
               <Separator />
                <CommentForm videoId={videoId}/>
            </div>
        </div>
    )
}