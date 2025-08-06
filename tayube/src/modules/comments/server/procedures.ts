import { db } from "@/db";
import {  commentReactions, comments, users } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProduce } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import {  and, count, desc, eq, getTableColumns, inArray, isNotNull, isNull, lt, or } from "drizzle-orm";
import { z } from "zod";

export const commentRouter = createTRPCRouter({
    create: protectedProduce
        .input(z.object({
            parentId: z.string().uuid().nullish(),
            videoId:z.string().uuid(),
            value:z.string()
        }))
        .mutation(async ({input,ctx}) => {
            const {id: userId} = ctx.user
            const {videoId, value, parentId} = input
            
            const [existingComment] = await db 
                .select()
                .from(comments)
                .where(inArray(comments.id, parentId ? [parentId] : []))
            if(!existingComment && parentId) { 
                throw new TRPCError({code: "NOT_FOUND"})
            }

            if(existingComment?.parentId && parentId) {
                throw new TRPCError({code: "BAD_REQUEST"})
            }

            const [createComment] = await db
                .insert(comments)
                .values({userId, videoId,parentId, value})
                .returning()
            return createComment
        }),
    remove: protectedProduce
        .input(z.object({
            id:z.string().uuid(),
        }))
        .mutation(async ({input,ctx}) => {
            const {id: userId} = ctx.user
            const {id} = input
        
            const [deleComment] = await db
                .delete(comments)
                .where(and(
                    eq(comments.userId, userId),
                    eq(comments.id , id ) 
                ))
                .returning()

                if(!deleComment) {
                    throw new TRPCError({code:"NOT_FOUND"})
                }
            return deleComment
        }),
    getMany: baseProcedure
    .input(
        z.object({
            videoId: z.string().uuid(),
            parentId: z.string().uuid().nullish(),
            cursor: z.object({
                id: z.string().uuid(),
                updateAt: z.date()
            }).nullish(),
            limit: z.number().min(1).max(100),
        })
    )
    .query(async ({input, ctx}) => {
        const {ClerkUserId} = ctx
        const {videoId, cursor, parentId, limit} = input

        let userId
        const [user] = await db 
            .select()
            .from(users)
            .where(inArray(users.clerkId, ClerkUserId ? [ClerkUserId] : []))
        if(user) {
            userId = user.id
        }
        const viewerReactions = db.$with('viewer_reactions').as(
            db
            .select({
                commentId: commentReactions.commentId,
                type: commentReactions.type
            })
            .from(commentReactions)
            .where(inArray(commentReactions.userId, userId ? [userId]: []))
        )


        const replies = db.$with("replies").as(
            db
                .select({
                    parentId: comments.parentId,
                    count: count(comments.id).as("count")
                })
                .from(comments)
                .where(isNotNull(comments.parentId))
                .groupBy(comments.parentId)
        )

        const [totalData, data] = await Promise.all([
        db
            .select({
                count: count()
            })
            .from(comments)
            .where(and(
                eq(comments.videoId, videoId),
                // isNull(comments.parentId),
            )
            ),
        db
            .with(viewerReactions,replies)
            .select({
                ...getTableColumns(comments),
                user:users,
                viewerReaction: viewerReactions.type,
                replyCount: replies.count,
                likeCount: db.$count(
                    commentReactions,
                    and(
                        eq(commentReactions.type, "like" ),
                        eq(commentReactions.commentId, comments.id)
                    )
                ),
                dislikeCount: db.$count(
                    commentReactions,
                    and(
                        eq(commentReactions.type, "dislike" ),
                        eq(commentReactions.commentId, comments.id)
                    )
                )
                
            })
            .from(comments)

            .where(and(
                eq(comments.videoId, videoId),
                parentId ? eq(comments.parentId, parentId) : isNull(comments.parentId),
                cursor
                    ? or(
                        lt(comments.updateAt, cursor.updateAt),
                        and(
                            eq(comments.updateAt, cursor.updateAt),
                            lt(comments.id, cursor.id)
                        )
                    )
                    : undefined
            ))
            .innerJoin(users, eq(comments.userId, users.id))
            .leftJoin(viewerReactions, eq(comments.id, viewerReactions.commentId))
            .leftJoin(replies, eq(comments.id, replies.parentId))
            .orderBy(desc(comments.updateAt), desc(comments.id ))
            .limit(limit + 1)
        ])
       
            
            const hasMore = data.length > limit;
            const items = hasMore ? data.slice(0, -1) : data;
            const lastItem = items[items.length - 1];
            const nextCursor = hasMore
              ? {
                  id: lastItem.id,
                  updateAt: lastItem.updateAt,
                }
              : null;
            return {
                totalCount: totalData[0].count,
                items,
                nextCursor,
            };
})
})