import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { createTRPCRouter, protectedProduce } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const commentReactionsRouter = createTRPCRouter({
    like: protectedProduce
        .input(z.object({commentId: z.string().uuid()}))
        .mutation(async ({input,ctx}) => {
            const {commentId} = input
            const {id: userId} = ctx.user
            const [existingCommentReactionlike] = await db
                .select()
                .from(commentReactions)
                .where(and(
                    eq(commentReactions.commentId, commentId),
                    eq(commentReactions.userId, userId),
                    eq(commentReactions.type, "like")
                ))
                if(existingCommentReactionlike) {
                    const [deletedViewReaction] = await db
                        .delete(commentReactions)
                        .where(
                            and(
                                eq(commentReactions.userId, userId),
                                eq(commentReactions.commentId, commentId)
                            )
                        )
                        .returning()
                    return deletedViewReaction
                }
                const [createdCommentReactions] = await db
                    .insert(commentReactions)
                    .values({userId, commentId, type: "like"})
                    .onConflictDoUpdate({
                        target: [commentReactions.userId, commentReactions.commentId],
                        set: {
                            type:"like"
                        }
                    })
                    .returning()
                return createdCommentReactions
        }),
    dislike: protectedProduce
        .input(z.object({commentId: z.string().uuid()}))
        .mutation(async ({input,ctx}) => {
            const {id: userId} = ctx.user
            const {commentId} = input
            const [existingVideoReactiondislike] = await db
                .select()
                .from(commentReactions)
                .where(and(
                    eq(commentReactions.commentId, commentId),
                    eq(commentReactions.userId, userId),
                    eq(commentReactions.type, "dislike")
                ))
                if(existingVideoReactiondislike) {
                    const [deletedViewReaction] = await db
                        .delete(commentReactions)
                        .where(
                            and(
                                eq(commentReactions.userId, userId),
                                eq(commentReactions.commentId, commentId)
                            )
                        )
                        .returning()
                    return deletedViewReaction
                }
                const [createdCommentReactions] = await db
                    .insert(commentReactions)
                    .values({userId, commentId, type: "dislike"})
                    .onConflictDoUpdate({
                        target: [commentReactions.userId, commentReactions.commentId],
                        set: {
                            type:"dislike"
                        }
                    })
                    .returning()
                return createdCommentReactions
        })
    })