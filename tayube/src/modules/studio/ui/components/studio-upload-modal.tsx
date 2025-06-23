"use client"
import { ResponsiveModal } from "@/components/responsive-modal"
import { Button } from "@/components/ui/button"
import { trpc } from "@/trpc/client"
import { Loader2Icon, PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { StudioUpload } from "./studio-upload"

export const StudioUploadModel = () => {
    const utils = trpc.useUtils()
    const create = trpc.videos.create.useMutation({
        onSuccess: () => {
            toast.success("video create")
            utils.studio.getMany.invalidate()
        },
        onError: () => {
            toast.error("something wroong")
        }
    })
    return (
        <>
            <ResponsiveModal title="upload video " open={!!create.data?.url} onOpenChange={() => create.reset()}>
               {create.data?.url ? <StudioUpload endpoint={create.data.url} onSuccess={() => {}} /> : <Loader2Icon /> }
            </ResponsiveModal>
            <Button variant="secondary" onClick={() => create.mutate()} disabled={create.isPending}> 
                {create.isPending ? <Loader2Icon className="animate-spin"/> : <PlusIcon />}
                Create
            </Button>
        </>
    )
}