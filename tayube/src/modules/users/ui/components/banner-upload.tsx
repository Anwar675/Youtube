
import { ResponsiveModal } from "@/components/responsive-modal";
import { UploadDropzone } from "@/lib/uploadthing";
import { trpc } from "@/trpc/client";
interface BannerloadModalProps {
    userId:string
    open:boolean
    onOpenChange: (open:boolean) => void
}

export const BannerloadModal = ({
    userId,
    open,
    onOpenChange
}: BannerloadModalProps) => {
    const utils = trpc.useUtils() 

    const onClientUploadComplete = () => {
        utils.users.getOne.invalidate({id: userId})
        onOpenChange(false)
    }
    return  (
        <ResponsiveModal
            title="upload a banner"
            open={open}
            onOpenChange={onOpenChange}
        >
            <UploadDropzone endpoint="bannerUpload" onClientUploadComplete={onClientUploadComplete}/>
        </ResponsiveModal>
    )    
}