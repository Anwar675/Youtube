import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { createTRPCRouter, protectedProduce } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const SubcriptionsRouter = createTRPCRouter({
    create: protectedProduce
        .input(z.object({userId: z.string().uuid()}))
        .mutation(async ({input,ctx}) => {
            const {userId} = input
            if(userId === ctx.user.id) {
                throw new TRPCError({code: 'BAD_REQUEST'})
            }
            const [createSubscription] = await db
                .insert(subscriptions)
                .values({viewerId: ctx.user.id, creatorId: userId})
                .returning()
            return createSubscription
        }),
    remove: protectedProduce
        .input(z.object({userId: z.string().uuid()}))
        .mutation(async ({input,ctx}) => {
            const {userId} = input
            if(userId === ctx.user.id) {
                throw new TRPCError({code: 'BAD_REQUEST'})
            }
            const [deleteSubscription] = await db
                .delete(subscriptions)
                .where(
                    and(
                        eq(subscriptions.viewerId, ctx.user.id),
                        eq(subscriptions.creatorId, userId)
                    )
                )
                .returning()
            return deleteSubscription
        })
})