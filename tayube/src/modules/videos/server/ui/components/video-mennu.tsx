import { Button } from "@/components/ui/button"
import { DropdownMenuContent, DropdownMenu, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { ListIcon, MoreVerticalIcon, ShareIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

interface VideoMenuProps {
    videoId: string
    variant?: "ghost" | "new"
    onRemove?: () => void
}


export const VideoMenu = ({
    videoId,
    variant,
    onRemove
}: VideoMenuProps) => {
    const onShare = () => {
        const fullUrl = `${process.env.VERCEL_URL || 'http://localhost:3000'}/videos/${videoId}`;
        navigator.clipboard.writeText(fullUrl)
        toast.success('Link copied to the clipboard ')
    }
   return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant={variant} size="icon" className="rounded-full">
                <MoreVerticalIcon />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()} >
            <DropdownMenuItem onClick={onShare}>
                <ShareIcon className="mr-2 size-4 "/>
                Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
                <ListIcon className="mr-2 size-4 "/>
                Add a playlist 
            </DropdownMenuItem>
            {onRemove && (                                                        
                <DropdownMenuItem onClick={() => {}}>
                    <Trash2Icon className="mr-2 size-4 "/>
                    Remove
                </DropdownMenuItem>
            )}
        </DropdownMenuContent>
    </DropdownMenu>
   )
}