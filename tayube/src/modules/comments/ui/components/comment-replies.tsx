import { DEFAULT_LIMIT } from "@/constans"
import { trpc } from "@/trpc/client"
import { CornerDownRight, Loader2Icon } from "lucide-react"
import { CommentItems } from "./comment-item"
import { Button } from "@/components/ui/button"

interface CommentRepliesProps {
    parentId: string,
    videoId:string
}

export const CommentReplies = ({
    parentId,
    videoId
}: CommentRepliesProps) => {
    const {data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage} = trpc.comments.getMany.useInfiniteQuery({
        limit: DEFAULT_LIMIT,
        videoId,
        parentId
    }, {
        getNextPageParam: (lastPage: {
            nextCursor: { id: string; updateAt: Date } | null;
        }) => lastPage.nextCursor,
    })
    return (
        <div className="pl-14">
            <div className="flex flex-col gap-4 mt-2">
                {isLoading && (
                    <div className="flex items-center justify-center">
                        <Loader2Icon className="size-6 text-white animate-spin " />
                    </div>
                )}
                {!isLoading && data?.pages
                    .flatMap((page) => page.items)
                    .map((comment) => (
                        <CommentItems key={comment.id} comment={comment} variant="reply" />
                    ))
                    }
            </div>
            {hasNextPage && (
                <Button variant="tertiary" size="sm" onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="flex items-center justify-center">
                    <CornerDownRight />
                    Show more replies
                </Button>
            )}
        </div>
    )
}