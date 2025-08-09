import { db } from '@/db';
import { z } from 'zod';
import { users, videoReactions, videos, videoViews } from '@/db/schema';
import { createTRPCRouter, protectedProduce } from '@/trpc/init';
import { and, desc, eq, getTableColumns, lt, not, or } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';


export const suggestionRouter = createTRPCRouter({
  
  getMany: protectedProduce
    .input(
      z.object({
        videoId: z.string().uuid(),
        cursor: z
          .object({
            id: z.string().uuid(),
            updateAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      })
    )
    .query(async ({ input }) => {
      const { videoId,  cursor, limit } = input;
      const [existingVideo] = await db 
        .select()
        .from(videos)
        .where(eq(videos.id, videoId))


      if(!existingVideo) {
        throw new TRPCError({code: "NOT_FOUND"})
      }
      const data = await db
        .select({
          ...getTableColumns(videos),
          user:users,
          viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likeCount: db.$count(videoReactions, and(
            eq(videoReactions.videoId, videos.id),
            eq(videoReactions.type,"like")
          )),
          dislikeCount: db.$count(videoReactions, and(
            eq(videoReactions.videoId, videos.id),
            eq(videoReactions.type,"dislike")
          ))
        })
        .from(videos)
        .innerJoin(users, eq(videos.userId, users.id))
        .where(
          and(
            not(eq(videos.id, existingVideo.id)),
            eq(videos.visibility, "public"),
            existingVideo.categoryId ? eq(videos.categoryId, existingVideo.categoryId) : undefined,
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
