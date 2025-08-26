'use client'
import { InfinitineSroll } from "@/components/infinite-scroll"
import { DEFAULT_LIMIT } from "@/constans"

import { trpc } from "@/trpc/client"
import Link from "next/link"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { toast } from "sonner"
import { SubscriptionItem, SubscriptionItemsSkeleton } from "../components/subscription-item"


export const SubscriptionsSection = () =>{
    return (
        <Suspense fallback={<SubscriptionsSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <SubscriptionsSectionSuspense  />
            </ErrorBoundary>
        </Suspense>
    )
}



const SubscriptionsSectionSkeleton = () => {
    return (      
        <div className="flex flex-col gap-4 gap-y-5 md:hidden"> 
            {Array.from({length:18}).map((_,index) => (
                <SubscriptionItemsSkeleton key={index}  />
            ))}
        </div>
    ) 
}

const SubscriptionsSectionSuspense = () => {
    const utils = trpc.useUtils()
    const [subscriptions, query] = trpc.subscriptions.getMany.useSuspenseInfiniteQuery({
           limit:DEFAULT_LIMIT
    },
    {
        getNextPageParam: (lastPage: {
            nextCursor: { id: string; updateAt: Date } | null;
        }) => lastPage.nextCursor,
    })
    const unSubscribe = trpc.subscriptions.remove.useMutation({
        onSuccess: (data) => {
            toast.success("UnSubscribed")
            utils.subscriptions.getMany.invalidate()
            utils.videos.getManySubscriptions.invalidate()
            utils.users.getOne.invalidate({id:data.creatorId})
    
            
        },
        onError: () => {
            toast.error("something went wrong")
          
        }
    })
    return (
        <div>
            <div className="flex flex-col gap-4 "> 
                {subscriptions.pages.flatMap((page) => page.items).map((subscription) => (
                    <Link key={subscription.creatorId} href={`/users/${subscription.user.id}`} >
                        <SubscriptionItem name={subscription.user.name} imageUrl={subscription.user.imageUrl} subscriberCount={subscription.user.subscribeCount}
                            onunSubscriptions={() => {
                                unSubscribe.mutate({userId: subscription.creatorId})
                            }}
                            disabled={unSubscribe.isPending}
                        />
                    </Link>
                ))}
            </div>
            
            <InfinitineSroll 
                hasNextPage={query.hasNextPage}  isFetchingNextpage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage}
            />
        </div>
    )
}