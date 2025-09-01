import { db } from "@/db";
import { subscriptions, users, videos } from "@/db/schema";
import {z} from "zod"
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq, getTableColumns, inArray, isNotNull} from "drizzle-orm";



export const userRouter = createTRPCRouter({
    
    getOne: baseProcedure
        .input(z.object({id: z.string().uuid()}))
        .query(async ({input,ctx}) => {
            const {ClerkUserId} =ctx
            let userId
            const [user] = await db
                .select()
                .from(users)
                .where(inArray(users.clerkId, ClerkUserId ? [ClerkUserId]: []))
            if(user) {
                userId = user.id
            }
            
            const viewerSubscriptions = db.$with("viewer_subscription").as(
                db
                    .select()
                    .from(subscriptions)
                    .where(inArray(subscriptions.viewerId, userId ? [userId]: []))
            )
            const [existingUser] = await db
            .with( viewerSubscriptions)
            .select({
                ...getTableColumns(users),
                viewerSubscribled: isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean),
                videoCount: db.$count(videos, eq(videos.userId, users.id)),
                subcriberCount: db.$count(subscriptions, eq(subscriptions.creatorId, users.id))
            })
            
            .from(users)
            .leftJoin(viewerSubscriptions, eq(viewerSubscriptions.creatorId, users.id))
            .where(eq(users.id, input.id))
            
            if (!existingUser) {
                throw new TRPCError({code: "NOT_FOUND"})
            }
            return existingUser
        }),
    

})