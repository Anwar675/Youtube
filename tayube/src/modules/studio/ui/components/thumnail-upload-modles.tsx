
import { ResponsiveModal } from "@/components/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";
interface ThumnailUploadModalProps {
    videoId:string
    open:boolean
    onOpenChange: (open:boolean) => void
}

export const ThumnailUploadModal = ({
    videoId,
    open,
    onOpenChange
}: ThumnailUploadModalProps) => {
    const utils = trpc.useUtils() 

    const onClientUploadComplete = () => {
        utils.studio.getMany.invalidate()
        utils.studio.getOne.invalidate({id: videoId})
        onOpenChange(false)
    }
    return  (
        <ResponsiveModal
            title="upload a thumnail"
            open={open}
            onOpenChange={onOpenChange}
        >
            <UploadDropzone endpoint="thumnailUploader" input={{videoId}} onClientUploadComplete={onClientUploadComplete}/>
        </ResponsiveModal>
    )    
}