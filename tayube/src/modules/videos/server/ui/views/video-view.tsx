import { CommentsSection } from "../sections/comment-section"
import { SuggestSection } from "../sections/suggestions-section"
import { VideoSection } from "../sections/video-section"

interface VideoViewProps {
    videoId: string
}
export const VideoView = ({videoId}: VideoViewProps) => { 
    return (
        <div className="flex flex-col max-w-[1700px] mx-auto pt-2.5 px-4 mb-10">
            <div className="flex flex-col xl:flex-row gap-6">
                <div className="flex-1 min-w-0">
                    <VideoSection videoId={videoId}/>
                    <div className="xl:hidden block mt-4t">
                        <SuggestSection />
                    </div> 
                    <CommentsSection videoId={videoId} />
                </div>
                <div className="hidden xl:block w-full xl:w-[380px] 2xl:[460px] shrink-0">
                    <SuggestSection />
                </div>
            </div>
        </div>
    )
}