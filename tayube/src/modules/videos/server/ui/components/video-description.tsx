import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

interface VideoDescriptionProps {
    compactViews: string;
    expandedViews: string;
    compactDate: string;
    expandedDate: string;
    description?: string | null
}

export const VideoDescription = ({
    compactViews,
    compactDate,
    expandedDate,
    expandedViews,
    description
}:VideoDescriptionProps) => {
    const [isExpaned, setIsExpended] = useState(false)
    return (
        <div onClick={() => setIsExpended((current) => !current)} className="bg-[#272727] rounded-xl cursor-pointer hover:bg-gray-800 transition p-3">
            <div className="flex gap-2 text-sm mb-2 ">
                <span className="font-medium  ">
                    {isExpaned ? expandedViews: compactViews} views
                </span>
                <span className="font-medium">
                   about {isExpaned ? expandedDate: compactDate} 
                </span>
            </div>
            <div className="relative ">
                <p className={cn("text-sm whitespace-pre-wrap",!isExpaned && "line-clamp-2" )}>
                    {description || "No description"}
                </p>
                <div className="flex items-center gap-1 mt-4 text-sm font-medium">
                    {isExpaned ? (
                        <>
                            Show less <ChevronUpIcon className="size-4 " />
                        </>
                    ): (
                        <>
                            Show more <ChevronDownIcon className="size-4 " />
                        </>  
                    )}
                </div>
            </div>
        </div>
    )
}