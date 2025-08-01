
import { DEFAULT_LIMIT } from "@/constans"
import { VideoView } from "@/modules/videos/server/ui/views/video-view"
import { HydrateClient, trpc } from "@/trpc/server"

interface PageProps {
    params: Promise<{
        videoId: string
    }>
}


const Page = async ({params}: PageProps) => {
    const {videoId} = await params
    void trpc.videos.getOne.prefetch({id: videoId})
    void trpc.comments.getMany.prefetchInfinite({videoId, limit:DEFAULT_LIMIT })
    return (
        <HydrateClient>
            <VideoView videoId={videoId} />
        </HydrateClient>
    )
}

export default Page