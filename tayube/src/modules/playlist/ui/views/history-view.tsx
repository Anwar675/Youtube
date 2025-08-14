import { HistoryVideosSection } from "./sections/history-video-section"

export const HistoryViews = () => {
    return (
        <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
            <div>
                <h1 className="text-2xl font-bold">History</h1>
                <p className="text-xs text-muted-foreground">
                    Videos your watched
                </p>
            </div>
            <HistoryVideosSection /> 
        </div>
    )
}