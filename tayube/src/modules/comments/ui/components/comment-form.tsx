'use client'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { UserAvata } from "@/components/user-avatar"

import { trpc } from "@/trpc/client"
import { useClerk, useUser } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface CommentFormProps {
    videoId: string
    onSuccess?: () => void
    parentId?: string;
    onCancel?: () => void; 
    variant?: "comment"|"reply"
}

// Create a form-specific schema instead of using omit() on drizzle-zod schema
const commentFormSchema = z.object({
    videoId: z.string().uuid(),
    parentId: z.string().uuid().optional(),
    value: z.string().min(1, "Comment cannot be empty")
});

type CommentFormData = z.infer<typeof commentFormSchema>;

export const CommentForm = ({videoId, onSuccess, onCancel, parentId, variant  ="comment"}: CommentFormProps) => {
    const clerk = useClerk()
    const {user} = useUser()
    const utils = trpc.useUtils()
   

    const form = useForm<CommentFormData>({
        resolver: zodResolver(commentFormSchema),
        defaultValues: {
            videoId: videoId,
            parentId: parentId,
            value: ""
        }
    })
    const create = trpc.comments.create.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({videoId});
            utils.comments.getMany.invalidate({videoId, parentId});
            form.reset();
            toast.success("Comment added");
            onSuccess?.()
        },
        onError:(error) => {
            toast.error("Something went wrong ")
            if(error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn()
            }
        }
        })
    const handleSubmit = (values: CommentFormData) => {
        create.mutate(values as { videoId: string; value: string })
    }

    const handleCancel = () => {
        form.reset()
        onCancel?.()
    }

    return (
        <Form {...form}>          
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-4 group">
                <UserAvata size="lgg" imageUrl={user?.imageUrl || '/user-logo.svg'} name={user?.username || "User"}/>
                <div className="flex-1">
                    <FormField control={form.control} name="value" render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <Textarea {...field} placeholder={variant === 'reply' ? "Reply to this comment..." : "Add a comment..."} className="resize-none bg-transparent overflow-hidden min-h-0" />           
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <div className="justify-end gap-2 mt-2 flex">
                        {onCancel && (
                            <Button variant="ghost" type="button" onClick={handleCancel}>
                                Cancel
                            </Button>
                        )}
                        <Button type="submit" variant="new" size="sm" disabled={create.isPending}>
                            {variant === "reply" ? "Reply" : "Comment"}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}