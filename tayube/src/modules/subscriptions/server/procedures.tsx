import { db } from "@/db";
import { subscriptions, users } from "@/db/schema";
import { createTRPCRouter, protectedProduce } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, lt, or } from "drizzle-orm";
import { z } from "zod";

export const SubcriptionsRouter = createTRPCRouter({
    getMany: protectedProduce  
            .input(
              z.object({    
                cursor: z
                  .object({
                    creatorId: z.string().uuid(),
                    updateAt: z.date(),
                  })
                  .nullish(),
                limit: z.number().min(1).max(100),
              })
            )
            .query(async ({ input,ctx }) => {
              const { cursor, limit} = input;
              const {id: userId} = ctx.user
             
              const data = await db
                .select({
                    ...getTableColumns(subscriptions),
                    user: {
                        ...getTableColumns(users),
                        subscribeCount: db.$count(
                            subscriptions,
                            eq(subscriptions.creatorId, users.id)
                        )
                    }
                })
                .from(subscriptions)
        
                .innerJoin(users, eq(subscriptions.creatorId, users.id))
                .where(
                  and(  
                    eq(subscriptions.viewerId, userId),
                    cursor
                      ? or(
                          lt(subscriptions.updateAt, cursor.updateAt),
                          and(
                            eq(subscriptions.updateAt, cursor.updateAt),
                            lt(subscriptions.creatorId, cursor.creatorId)
                          )
                        )
                      : undefined 
                  )
                )
                .orderBy(desc(subscriptions.updateAt), desc(subscriptions.creatorId))
                .limit(limit + 1);
              const hasMore = data.length > limit;
              const items = hasMore ? data.slice(0, -1) : data;
              const lastItem = items[items.length - 1];
              const nextCursor = hasMore
                ? {
                    creatorId: lastItem.creatorId,
                    updateAt: lastItem.updateAt,
                  }
                : null;
              return {
                items,
                nextCursor,
              };
    }),
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