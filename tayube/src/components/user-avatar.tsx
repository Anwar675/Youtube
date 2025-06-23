import { Avatar, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const avatarVariants = cva("", {
    variants: {
        size: {
            default: "h-9 w-9",
            xs: "h-[20px] w-[20px]",
            sm: "h-6 w-6",
            lgg: "h-10 w-10",
            xl: "h-[160px] w-[160px]"
        }
    },
    defaultVariants: {
        size: "default"
    }
})

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
    imageUrl: string,
    name: string,
    className?: string,
    onClick?: () => void
}

export const UserAvata = ({imageUrl, name, className,size, onClick}: UserAvatarProps) => {
    return (
        <Avatar className={cn(avatarVariants({size,className}))} onClick={onClick}>
            <AvatarImage src={imageUrl} alt={name} />
        </Avatar>
    )
}