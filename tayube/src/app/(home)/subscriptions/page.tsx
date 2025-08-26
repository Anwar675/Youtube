import { DEFAULT_LIMIT } from "@/constans"
import { SubscriptionsViews } from "@/modules/subscriptions/ui/views/subscription-views"
import { HydrateClient, trpc } from "@/trpc/server"

const Page = async () => {
    void trpc.subscriptions.getMany.prefetchInfinite({
        limit: DEFAULT_LIMIT
    })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
    return (
        <HydrateClient>
            <SubscriptionsViews />
        </HydrateClient>
    )
}

export default Page