import { db } from "@/db";
import { videoReactions } from "@/db/schema";
import { createTRPCRouter, protectedProduce } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const videoReactionsRouter = createTRPCRouter({
    like: protectedProduce
    .input(z.object({videoId: z.string().uuid()}))
    .mutation(async ({input,ctx}) => {
        const {id: userId} = ctx.user
        const {videoId} = input
        const [existingVideoReactionlike] = await db
            .select()
            .from(videoReactions)
            .where(and(
                eq(videoReactions.videoId, videoId),
                eq(videoReactions.userId, userId),
                eq(videoReactions.type, "like")
            ))
            if(existingVideoReactionlike) {
                const [deletedViewReaction] = await db
                    .delete(videoReactions)
                    .where(
                        and(
                            eq(videoReactions.userId, userId),
                            eq(videoReactions.videoId, videoId)
                        )
                    )
                    .returning()
                return deletedViewReaction
            }
            const [createdVideoReactions] = await db
                .insert(videoReactions)
                .values({userId, videoId, type: "like"})
                .onConflictDoUpdate({
                    target: [videoReactions.userId, videoReactions.videoId],
                    set: {
                        type:"like"
                    }
                })
                .returning()
            return createdVideoReactions
    }),
    dislike: protectedProduce
    .input(z.object({videoId: z.string().uuid()}))
    .mutation(async ({input,ctx}) => {
        const {id: userId} = ctx.user
        const {videoId} = input
        const [existingVideoReactiondislike] = await db
            .select()
            .from(videoReactions)
            .where(and(
                eq(videoReactions.videoId, videoId),
                eq(videoReactions.userId, userId),
                eq(videoReactions.type, "dislike")
            ))
            if(existingVideoReactiondislike) {
                const [deletedViewReaction] = await db
                    .delete(videoReactions)
                    .where(
                        and(
                            eq(videoReactions.userId, userId),
                            eq(videoReactions.videoId, videoId)
                        )
                    )
                    .returning()
                return deletedViewReaction
            }
            const [createdVideoReactions] = await db
                .insert(videoReactions)
                .values({userId, videoId, type: "dislike"})
                .onConflictDoUpdate({
                    target: [videoReactions.userId, videoReactions.videoId],
                    set: {
                        type:"dislike"
                    }
                })
                .returning()
            return createdVideoReactions
    })
})