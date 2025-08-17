import { PlaylistGetManyOutput } from "@/modules/playlist/type";

interface PlaylistInforProps {
    data: PlaylistGetManyOutput["items"][number]
}

export const PlaylistInfor = ({data}: PlaylistInforProps) => {
    return (
        <div className="flex gap-3">
            <div className="min-w-0 flex-1">
                <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-sm break-words"> 
                    {data.name}
                </h3>
                <p className="text-sm text-muted-foreground">Playlist</p>
                <p className="text-sm text-muted-foreground font-semibold hover:text-white">View full playlist</p>
            </div>
        </div>
    )
}