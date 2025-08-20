
import { PlaylistHeaderSection } from "./sections/playlist-header-section"
import { VideosSection } from "./sections/video-section"

interface VideoViewProps {
    playlistId: string
}
export const VideoView = ({playlistId}: VideoViewProps) => {
    return (
        <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
            <PlaylistHeaderSection playlistId={playlistId} />
            <VideosSection playlistId={playlistId} /> 
        </div>
    )
}