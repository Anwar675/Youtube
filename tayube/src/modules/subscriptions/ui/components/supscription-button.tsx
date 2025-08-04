import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";


interface SupscriptionButtonProps {
    onClick: ButtonProps["onClick"]
    disabled: boolean
    isSubcribled: boolean
    className?:string
    size?: ButtonProps["size"]
}

export const SupscriptionButton = ({
    onClick,
    disabled,
    isSubcribled,
    className,
    size
}: SupscriptionButtonProps) => {
    return (
        <Button size={size} onClick={onClick} disabled={disabled} variant={isSubcribled ? "new": "white"} className={cn("rounded-full", className)}>
            {isSubcribled ? "Unsubcribe" : "Subcribe"}
        </Button>
    )
}