import { cn } from "@/lib/utils";
import { UserGetOutput } from "../../types";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Edit2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BannerloadModal } from "./banner-upload";
import { useState } from "react";

interface UserPageBannerProps {
    user: UserGetOutput
}

export const UserpageBannerSkeleton = () => {
    return <Skeleton className="w-full max-h-[200px] h-[15vh] md:h-[25vh]" />
}

export const UserpageBanner = ({user}: UserPageBannerProps) => {
    const {userId} = useAuth()
    const [isBannerUploadModal, setIsBannerUploadModal] = useState(false)
    return (
        <div className="relative group">
            <BannerloadModal userId={user.id} open={isBannerUploadModal} onOpenChange={setIsBannerUploadModal} />
            <div className={cn(
                "w-full max-h-[200px] h-[15vh] md:h-[25vh] bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl ", user.bannerUrl ? "bg-cover bg-center" : "bg-gray-200" 
            )} style={{
                backgroundImage: user.bannerUrl ? `url(${user.bannerUrl})` : undefined
            }}>  
                {user.clerkId === userId && (
                    <Button onClick={() => setIsBannerUploadModal(true)} type="button" size="icon" className="absolute top-4 right-4 rounded-full bg-white/50 hover:bg-gray-200 opacity-100 md:opacity-0 group-hover:opacity-100 duration-300 ">
                        <Edit2Icon className="size-4 text-black" />
                    </Button>
                )}
            </div>
        </div>
    )
}