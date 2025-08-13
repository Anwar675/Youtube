import { DEFAULT_LIMIT } from "@/constans"
import { SubscribeView } from "@/modules/home/ui/views/subscriptions-view"

import { HydrateClient, trpc } from "@/trpc/server"


export const dynamic = "force-dynamic"



const Page = async () => {
  void trpc.videos.getManySubscriptions.prefetchInfinite({ limit: DEFAULT_LIMIT})
  return (
      <HydrateClient>
        <SubscribeView />
      </HydrateClient>   
  )
}

export default Page