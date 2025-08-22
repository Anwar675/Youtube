import { SubscriptionVideosSection } from "../sections/subcription-view-section"


export const SubscribeView = () => {
    return (
        <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
            <div>
                <h1 className="text-2xl font-bold">New</h1>
               
            </div>
            <SubscriptionVideosSection /> 
        </div>
    )
}