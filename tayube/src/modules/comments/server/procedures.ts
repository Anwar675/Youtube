import { db } from "@/db";
import {  comments, users } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProduce } from "@/trpc/init";
import {  and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
import { z } from "zod";

export const commentRouter = createTRPCRouter({
    create: protectedProduce
        .input(z.object({
            videoId:z.string().uuid(),
            value:z.string()
        }))
        .mutation(async ({input,ctx}) => {
            const {id: userId} = ctx.user
            const {videoId, value} = input
        
            const [createComment] = await db
                .insert(comments)
                .values({userId, videoId, value})
                .returning()
            return createComment
        }),
    getMany: baseProcedure
    .input(
        z.object({
            videoId: z.string().uuid(),
            cursor: z.object({
                id: z.string().uuid(),
                updateAt: z.date()
            }).nullish(),
            limit: z.number().min(1).max(100),
        })
    )
    .query(async ({input}) => {
        const {videoId, cursor, limit} = input
        const data = await db
            .select({
                ...getTableColumns(comments),
                user:users,
                totalCount: db.$count(comments, eq(comments.videoId, videoId))
            })
            .from(comments)
            .where(and(
                eq(comments.videoId, videoId),
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
            .orderBy(desc(comments.updateAt), desc(comments.id ))
            .limit(limit + 1)
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
              items,
              nextCursor,
            };
})
})