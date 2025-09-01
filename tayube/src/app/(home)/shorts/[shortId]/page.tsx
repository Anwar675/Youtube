import { ShortViews } from "@/modules/shorts/ui/views/short-view"
import { HydrateClient, trpc } from "@/trpc/server"

export const dynamic = "force-dynamic"
interface PageProps {
    params: Promise<{shortId: string}>
}


const Page= async ({params}: PageProps) => {
    const { shortId} = await params
    void trpc.videos.getOne.prefetch({ id: shortId })
    
    return (
       <HydrateClient>
            <ShortViews shortId={shortId} />
        </HydrateClient>
    )   

}

export default Page