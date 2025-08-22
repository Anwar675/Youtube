"use client"
import { trpc } from "@/trpc/client"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { UserpageBanner, UserpageBannerSkeleton } from "../components/user-page-banner"
import { UserPageInfor, UserPageInforSkeleton } from "../components/user-page-infor"
import { Separator } from "@/components/ui/separator"

interface UserSectionProps {
    userId: string
}

export const UserSection = (props: UserSectionProps) => {
    return (
        <Suspense fallback={<UserSectionSkeleton />}>
            <ErrorBoundary fallback={<p>Error...</p>}>
                <UserSectionSuspense {...props} />
            </ErrorBoundary>
        </Suspense>
    )
}


const UserSectionSkeleton = () => {
    return (
        <div className="flex flex-col">
            <UserpageBannerSkeleton />
            <UserPageInforSkeleton />
        </div>
    )
}

const UserSectionSuspense = ({userId}: UserSectionProps) => {
    const [user] = trpc.users.getOne.useSuspenseQuery({id: userId})

    return (
        <div className="flex flex-col ">
            <UserpageBanner user={user} />
            <UserPageInfor user={user} />
            <Separator />
        </div>
    )
}