
import { cn } from "@/lib/utils"
import { TooltipTrigger, Tooltip, TooltipContent } from "@/components/ui/tooltip"
import {cva, type VariantProps} from "class-variance-authority"


const userInforVariants = cva("flex items-center gap-1", {
    variants: {
        size: {
            default: "[&_p]:text-sm [&_svg]:size-4",
            lg: "[&_p]:text-base [&_svg]:size-5 [&_p]:font-medium [&_p]:text-white",
            sm: "[&_p]:text-xs [&_svg]:size-3.5",
        }
    },
    defaultVariants: {
        size:"default"
    }
})

interface UserInforProps extends VariantProps<typeof userInforVariants> {
    name: string,
    className?:string
}

export const UserInfor = ({
    name,
    className,
    size
}: UserInforProps) => {
    return (
        <div className={cn(userInforVariants({size,className}))}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <p className="text-gray-500 line-clamp-1">
                        {name}
                    </p>
                </TooltipTrigger>
                <TooltipContent align="center" sideOffset={20} className="bg-[#3d3d3d]">
                    <p>{name}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}