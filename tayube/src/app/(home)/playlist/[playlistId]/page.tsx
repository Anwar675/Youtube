import { DEFAULT_LIMIT } from "@/constans"

import { VideoView } from "@/modules/playlist/ui/views/video-view"
import { HydrateClient, trpc } from "@/trpc/server"

export const dynamic = "force-dynamic"
interface PageProps {
    params: Promise<{playlistId: string}>
}


const Page= async ({params}: PageProps) => {
    const { playlistId} = await params
    void trpc.playlist.getOne.prefetch(
        { id: playlistId}
    )
    void trpc.playlist.getVideos.prefetchInfinite(
        {  playlistId, limit: DEFAULT_LIMIT}
    )

    return (
        <HydrateClient>
            <VideoView playlistId={playlistId} />
        </HydrateClient>
    )

}

export default Page