import { db } from '@/db';
import { z } from 'zod';
import { videos } from '@/db/schema';
import { createTRPCRouter, protectedProduce } from '@/trpc/init';
import { and, desc, eq, lt, or } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const studioRouter = createTRPCRouter({
  getOne: protectedProduce
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;
      const { id } = input;
      const [video] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, id), eq(videos.userId, userId)));
      if(!video) {
        throw new TRPCError({code: "NOT_FOUND"})
      }


      return video
    }),
  getMany: protectedProduce
    .input(
      z.object({
        cursor: z
          .object({
            id: z.string().uuid(),
            updateAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const { id: userId } = ctx.user;
      const data = await db
        .select()
        .from(videos)
        .where(
          and(
            eq(videos.userId, userId),
            cursor
              ? or(
                  lt(videos.updateAt, cursor.updateAt),
                  and(
                    eq(videos.updateAt, cursor.updateAt),
                    lt(videos.id, cursor.id)
                  )
                )
              : undefined 
          )
        )
        .orderBy(desc(videos.updateAt), desc(videos.id))
        .limit(limit + 1);
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
    }),
});
