import { db } from "@/db";
import {  users, videoReactions, videos, videoViews , playlist, playlistVideos} from "@/db/schema";
import {z} from "zod"
import {  createTRPCRouter, protectedProduce } from "@/trpc/init";

import { and, desc, eq, getTableColumns,  lt, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";


export const playlistRouter = createTRPCRouter({   
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
      .query(async ({ input,ctx }) => {
        const {id: userId} = ctx.user
        const { cursor, limit} = input;
          
          
        const data = await db
          .select({
              ...getTableColumns(playlist),
              videoCount: db.$count(
                playlistVideos,
                eq(playlist.id,playlistVideos.playlistId)
              ),
              user:users,            
          })
          .from(playlist)
  
          .innerJoin(users, eq(playlist.userId, users.id))
          .where(
            and(
              eq(playlist.userId, userId),
              cursor
                ? or(
                    lt(playlist.updateAt, cursor.updateAt),
                    and(
                      eq(playlist.updateAt, cursor.updateAt),
                      lt(videos.id, cursor.id)
                    )
                  )
                : undefined 
            )
          )
          .orderBy(desc(playlist.updateAt), desc(playlist.id))
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
  create: protectedProduce
    .input(z.object({name: z.string().min(1)}))
    .mutation(async ({input, ctx}) => {
      const {name} = input
      const {id: userId} = ctx.user

      const [createdPlaylist] = await db
      .insert(playlist)
      .values({
        userId,
        name
      })
      .returning()
      if(!createdPlaylist) {
        throw new TRPCError({code: "BAD_REQUEST"})
      }
      return createdPlaylist
    }),
  getHistory: protectedProduce
      .input(
        z.object({          
          cursor: z
            .object({
              id: z.string().uuid(),
              viewedAt: z.date(),
            })
            .nullish(),
          limit: z.number().min(1).max(100),
        })
      )
      .query(async ({ input,ctx }) => {
          const {id: userId} = ctx.user
          const { cursor, limit} = input;
          const viewerVideosViews = db.$with("viewer_videos_views").as(
              db
              .select({
                  videoId: videoViews.videoId,
                  viewedAt: videoViews.updateAt
              })
              .from(videoViews)
              .where(eq(videoViews.userId,userId))
          )
        const data = await db
        .with(viewerVideosViews)
          .select({
              ...getTableColumns(videos),
              viewedAt: viewerVideosViews.viewedAt,
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
          .innerJoin(viewerVideosViews, eq(videos.id,viewerVideosViews.videoId))
          .where(
            and(
              eq(videos.visibility, "public"),
              cursor
                ? or(
                    lt(viewerVideosViews.viewedAt, cursor.viewedAt),
                    and(
                      eq(viewerVideosViews.viewedAt, cursor.viewedAt),
                      lt(videos.id, cursor.id)
                    )
                  )
                : undefined 
            )
          )
          .orderBy(desc(viewerVideosViews.viewedAt), desc(videos.id))
          .limit(limit + 1);
        const hasMore = data.length > limit;
        const items = hasMore ? data.slice(0, -1) : data;
        const lastItem = items[items.length - 1];
        const nextCursor = hasMore
          ? {
              id: lastItem.id,
              viewedAt: lastItem.viewedAt,
            }
          : null;
        return {
          items,
          nextCursor,
        };
  }),

})