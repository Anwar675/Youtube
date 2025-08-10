
"use client"
import { FilterCarousel } from "@/components/filter-carousel"
import { trpc } from "@/trpc/client"
import { useRouter } from "next/navigation"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"


interface CategorySectionProps {
    categoryId?: string
}


const CategoriesSectionSuspense = ({categoryId}: CategorySectionProps) => {
    const [categories] = trpc.categories.getMany.useSuspenseQuery()
    const router = useRouter()
    const data = categories.map((category) => ({
        value:category.id,
        label:category.name
    }))
    const onSelect = (value: string | null ) => {
        const url = new URL(window.location.href)
        if(value) {
            url.searchParams.set("categoryId",value)
        } else {
            url.searchParams.delete("categoryId")
        }
        router.push(url.toString())
    }
    

    return <FilterCarousel onSelect={onSelect} value={categoryId} data={data}/>
        
}

const CategoriesSkeleton = () =>  {
    return <FilterCarousel isLoading data={[]} onSelect={() => {}}/>
}

export const CategoriesSection = ({categoryId}: CategorySectionProps) => {
    return (
        <Suspense fallback={<CategoriesSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <CategoriesSectionSuspense categoryId={categoryId}/>
            </ErrorBoundary>
        </Suspense>
    )
}