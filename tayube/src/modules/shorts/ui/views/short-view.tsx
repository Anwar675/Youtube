"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { ShortSwiper } from "../components/short-swiper"

interface ShortViewsProps {
    shortId?: string 
}

export const ShortViewsSkeleton = () => {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Skeleton className="h-8 w-8 animate-spin rounded-full" />
            <span className="ml-2">Đang tải video...</span>
        </div>
    )
}

export const ShortViews = ({shortId}: ShortViewsProps) => {
    return (
        <Suspense fallback={<ShortViewsSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <ShortSwiper initialShortId={shortId} />
            </ErrorBoundary>    
        </Suspense>
    )
}