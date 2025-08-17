import { DEFAULT_LIMIT } from "@/constans"
import { PlaylistViews } from "@/modules/playlist/ui/views/playlist-view"
import { trpc } from "@/trpc/server"
import { HydrateClient } from "@/trpc/server"

const Page = async () =>{
    void trpc.playlist.getMany.prefetchInfinite({limit:DEFAULT_LIMIT})
    return (
        <HydrateClient>
            <PlaylistViews />
        </HydrateClient>
    )
}

export default Page