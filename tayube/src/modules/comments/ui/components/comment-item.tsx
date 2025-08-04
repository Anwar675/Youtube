import Link from "next/link";
import { CommentsGetManyOutput } from "../../type";
import { UserAvata } from "@/components/user-avatar";
import {  formatDistanceToNow } from "date-fns";
import { trpc } from "@/trpc/client";

import { Button } from "@/components/ui/button";
import { MessageSquareIcon, MoreVerticalIcon, ThumbsDownIcon, ThumbsUpIcon, Trash2Icon } from "lucide-react";
import { DropdownMenuContent,DropdownMenu, DropdownMenuTrigger, DropdownMenuItem  } from "@/components/ui/dropdown-menu";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";


interface CommentItemProps {
    comment:CommentsGetManyOutput["items"][number]
}                            

export const CommentItems = ({comment}: CommentItemProps) => {
    const clerk = useClerk()
    const {userId} = useAuth()
   
    const utils = trpc.useUtils()
    const remove= trpc.comments.remove.useMutation({
        onSuccess: () => {
            toast.success("Comment deleted")
            utils.comments.getMany.invalidate({videoId: comment.videoId})
        },
        onError: (error) => {
            toast.error("Something went wrong ")

            if(error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }
        }
    })

    const like = trpc.commentReactions.like.useMutation({
        onSuccess:()=>  {
            utils.comments.getMany.invalidate({videoId: comment.videoId})
        },
        onError: (error) => {
            toast.error("Something went wrong ")

            if(error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }
        }
    })
    const dislike = trpc.commentReactions.dislike.useMutation({
        onSuccess:()=>  {
            utils.comments.getMany.invalidate({videoId: comment.videoId})
        },
        onError: (error) => {
            toast.error("Something went wrong ")

            if(error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }
        }
    })
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
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                           <Button className="size-8" variant="ghost" disabled={like.isPending} onClick={() => like.mutate({commentId: comment.id})}>
                                <ThumbsUpIcon className={cn(comment.viewerReaction === "like" && "fill-white")}/>
                           </Button>
                            <span className="text-xs text-muted-foreground">
                                {comment.likeCount}
                            </span>
                           <Button className="size-8" variant="ghost" disabled={dislike.isPending} onClick={() => dislike.mutate({commentId: comment.id})}>
                                <ThumbsDownIcon className={cn(comment.viewerReaction === "dislike" && "fill-white")} />
                           </Button>
                           <span className="text-xs text-muted-foreground">
                                {comment.dislikeCount}
                            </span>
                        </div>
                       
                    
                    </div>
                </div>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVerticalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => {}}>
                            <MessageSquareIcon className="size-4" />
                            Reply
                        </DropdownMenuItem>
                        {comment.user.clerkId === userId && (
                            <DropdownMenuItem onClick={() => remove.mutate({id: comment.id}) }>
                                <Trash2Icon className="size-4" />
                                Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}