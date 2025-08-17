import { PlaylistGetManyOutput } from "@/modules/playlist/type";
import Link from "next/link";
import { THUMNAIL_FALLBACK } from '@/modules/videos/constans';
import { PlaylistThumbnail } from "./playlist-thumbnail";
import { PlaylistInfor } from "./playylist-infor";

interface PlaylistGridCardProps {
    data: PlaylistGetManyOutput["items"][number]
}

export const PlaylistGridCard = ({data}: PlaylistGridCardProps) => {
    return (
        <Link href={`/playlist/${data.id}`}>
            <div className="flex flex-col gap-2 w-full group">
                <PlaylistThumbnail imageUrl={THUMNAIL_FALLBACK} title={data.name} videoCount={data.videoCount} />
                <PlaylistInfor data={data} />
            </div>
        </Link>
    )
}