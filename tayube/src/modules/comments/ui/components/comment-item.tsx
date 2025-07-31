import Link from "next/link";
import { CommentsGetManyOutput } from "../../type";
import { UserAvata } from "@/components/user-avatar";
import {  formatDistanceToNow } from "date-fns";

interface CommentItemProps {
    comment:CommentsGetManyOutput["items"][number]
}                            

export const CommentItems = ({comment}: CommentItemProps) => {
    return (
        <div>
            <div className="flex gap-4 ">
                <Link href={`/users/${comment.userId}`}>
                    <UserAvata size="lgg" imageUrl={comment.user.imageUrl} name={comment.user.name}/>
                </Link>
                <div className="flex-1 min-w-0 ">
                    <Link  href={`/users/${comment.userId}`}>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-sm pb-0.5">
                                {comment.user.name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {formatDistanceToNow(comment.createAt, {
                                    addSuffix: true
                                })}
                            </span>
                        </div>
                    </Link>
                    <p className="text-sm">{comment.value}</p>
                </div>
            </div>
        </div>
    )
}