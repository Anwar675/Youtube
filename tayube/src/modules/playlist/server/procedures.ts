import { db } from "@/db";
import {  users, videoReactions, videos, videoViews , playlist, playlistVideos} from "@/db/schema";
import {z} from "zod"
import {  createTRPCRouter, protectedProduce } from "@/trpc/init";

import { and, desc, eq, getTableColumns,  lt, or, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";


export const playlistRouter = createTRPCRouter({  
  removeVideo: protectedProduce
    .input(z.object({
      playlistId: z.string().uuid(),
      videoId: z.string().uuid()
    }))
    .mutation(async ({input, ctx}) => {
      const {playlistId, videoId} = input
      const {id: userId} = ctx.user

      const [existingPlaylist] = await db
      .select()
      .from(playlist)
      .where(and(
        eq(playlist.id, playlistId),
        eq(playlist.userId, userId),
      ))

      if(!existingPlaylist) {
        throw new TRPCError({code: "NOT_FOUND"})
      }
      if(existingPlaylist.userId !== userId) {
        throw new TRPCError({code: "FORBIDDEN"})
      }
      const [existingVideo] = await db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId))
      if(!existingVideo) {
        throw new TRPCError({code: "NOT_FOUND"})
      }
      const [existingPlaylistVideo] = await db
      .select()
      .from(playlistVideos)
      .where(and(
        eq(playlistVideos.playlistId, playlistId),
        eq(playlistVideos.videoId, videoId),
      ))
      if(!existingPlaylistVideo) {
        throw new TRPCError({code: "NOT_FOUND"})
      }
      const [deletePlaylistVideos] = await db
        .delete(playlistVideos)
        .where(
          and(
            eq(playlistVideos.playlistId, playlistId),
            eq(playlistVideos.videoId, videoId)
          )
        )
        .returning()
      return deletePlaylistVideos
  }),
  getManyForVideo: protectedProduce
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
      .query(async ({ input,ctx }) => {
        const {id: userId} = ctx.user
        const { cursor, limit, videoId} = input;
          
          
        const data = await db
          .select({
              ...getTableColumns(playlist),
              videoCount: db.$count(
                playlistVideos,
                eq(playlist.id,playlistVideos.playlistId)
              ),
              user:users,            
              containsVideos: videoId ? sql<boolean>`(
                SELECT EXISTS (
                  SELECT 1
                  FROM ${playlistVideos} pv
                  WHERE pv.playlist_id = ${playlist.id} AND pv.video_id = ${videoId} 
                )
              )` : sql<boolean>`false`
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
                      lt(playlist.id, cursor.id)
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
  addVideo: protectedProduce
    .input(z.object({
      playlistId: z.string().uuid(),
      videoId: z.string().uuid()
    }))
    .mutation(async ({input, ctx}) => {
      const {playlistId, videoId} = input
      const {id: userId} = ctx.user

      const [existingPlaylist] = await db
      .select()
      .from(playlist)
      .where(and(
        eq(playlist.id, playlistId),
        eq(playlist.userId, userId),
      ))

      if(!existingPlaylist) {
        throw new TRPCError({code: "NOT_FOUND"})
      }
      if(existingPlaylist.userId !== userId) {
        throw new TRPCError({code: "FORBIDDEN"})
      }
      const [existingVideo] = await db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId))
      if(!existingVideo) {
        throw new TRPCError({code: "NOT_FOUND"})
      }
      const [existingPlaylistVideo] = await db
      .select()
      .from(playlistVideos)
      .where(and(
        eq(playlistVideos.playlistId, playlistId),
        eq(playlistVideos.videoId, videoId),
      ))
      if(existingPlaylistVideo) {
        throw new TRPCError({code: "CONFLICT"})
      }
      const [createPlaylistVideos] = await db
        .insert(playlistVideos)
        .values({playlistId, videoId})
        .returning()
      return createPlaylistVideos
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
              thumbnailUrl: sql<string | null>`(
                SELECT v.thumbnail_url
                FROM  ${playlistVideos} pv
                JOIN ${videos} v ON v.id = pv.video_id
                WHERE pv.playlist_id = ${playlist.id}
                ORDER BY pv.update_at DESC
                LIMIT 1
              )`    
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
                      lt(playlist.id, cursor.id)
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