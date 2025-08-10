import { DEFAULT_LIMIT } from "@/constans";
import { SearchViews } from "@/modules/search/ui/views/search-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

interface PageProps {
    searchParams: Promise<{
        query: string;
        categoryId: string| undefined
    }>
}
const  Page = async ({searchParams}: PageProps) => {
    const {query, categoryId} = await searchParams
    void trpc.categories.getMany.prefetch()
    void trpc.search.getMany.prefetchInfinite({
        query,
        categoryId,
        limit:DEFAULT_LIMIT
    })
    return (
        <HydrateClient>
           <SearchViews query={query} categoryId={categoryId} />
        </HydrateClient>

       
    )
}

export default Page