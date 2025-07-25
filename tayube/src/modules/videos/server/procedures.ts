import { db } from "@/db";
import { subscriptions, users, videoReactions, videos, videoUpdateSchema, videoViews } from "@/db/schema";
import { mux } from "@/lib/mux";
import {z} from "zod"
import { baseProcedure, createTRPCRouter, protectedProduce } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns, inArray, isNotNull } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { workflow } from "@/lib/qstash";


export const videosRouter = createTRPCRouter({
    getOne: baseProcedure
        .input(z.object({id: z.string().uuid()}))
        .query(async ({input,ctx}) => {
            const {ClerkUserId} =ctx
            let userId
            const [user] = await db
                .select()
                .from(users)
                .where(inArray(users.clerkId, ClerkUserId ? [ClerkUserId]: []))
            if(user) {
                userId = user.id
            }
            const viewerReactions = db.$with("viewer_reactions").as(
                db 
                    .select({
                        videoId: videoReactions.videoId, 
                        type: videoReactions.type
                    })
                    .from(videoReactions)
                    .where(inArray(videoReactions.userId, userId ? [userId] : []))
            )

            const viewerSubscriptions = db.$with("viewer_subscription").as(
                db
                    .select()
                    .from(subscriptions)
                    .where(inArray(subscriptions.viewerId, userId ? [userId]: []))
            )
            const [existingVideo] = await db
            .with(viewerReactions, viewerSubscriptions)
            .select({
                ...getTableColumns(videos),
                user: {
                    ...getTableColumns(users),
                    subcriberCount: db.$count(subscriptions, eq(subscriptions.creatorId, users.id)),
                    viewerSubscribed: isNotNull(viewerSubscriptions.viewerId).mapWith(Boolean)
                },
                viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
                likeCount: db.$count(videoReactions, and(
                    eq(videoReactions.videoId, input.id),
                    eq(videoReactions.type, "like")
                )),
                dislikeCount: db.$count(videoReactions, and(
                    eq(videoReactions.videoId, input.id),
                    eq(videoReactions.type, "dislike")
                )),
                viewerReaction: viewerReactions.type
            })
            .from(videos)
            .innerJoin(users, eq(videos.userId, users.id))
            .leftJoin(viewerReactions, eq(viewerReactions.videoId, videos.id))
            .leftJoin(viewerSubscriptions, eq(viewerSubscriptions.creatorId, users.id))
            .where(and(eq(videos.id, input.id)))
            // .groupBy(
            //     videos.id,
            //     users.id,
            //     viewerReactions.type
            // )
            if (!existingVideo) {
                throw new TRPCError({code: "NOT_FOUND"})
            }
            return existingVideo
        }),
    generateTitle: protectedProduce
        .input(z.object({id: z.string().uuid()}))
        .mutation(async ({ctx,input}) => {
            const {id: userId} = ctx.user
            const {workflowRunId} = await workflow.trigger({
                url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/title`,
                body: {userId, videoId: input.id}
            })
            return workflowRunId
    }),
    generateDescription: protectedProduce
        .input(z.object({id: z.string().uuid()}))
        .mutation(async ({ctx,input}) => {
            const {id: userId} = ctx.user
            const {workflowRunId} = await workflow.trigger({
                url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/description`,
                body: {userId, videoId: input.id}
            })
            return workflowRunId
    }),
    generateThumbnail: protectedProduce
        .input(z.object({id: z.string().uuid(), prompt: z.string().min(10)}))
        .mutation(async ({ctx,input}) => {
            const {id: userId} = ctx.user
            const {workflowRunId} = await workflow.trigger({
                url: `${process.env.UPSTASH_WORKFLOW_URL}/api/videos/workflows/thumbnail`,
                body: {userId, videoId: input.id, prompt: input.prompt}
            })
            return workflowRunId
    }),
    restoreThumbnail: protectedProduce
    .input(z.object(({id: z.string().uuid()})))
    .mutation(async ({ctx,input}) => {
        const {id: userId} = ctx.user
        const [existingVideo] = await db
            .select()
            .from(videos)
            .where(and(
                eq(videos.id, input.id),
                eq(videos.userId, userId)
            ))
        if(!existingVideo) {
            throw new TRPCError({code: "NOT_FOUND"})
        }

        if(existingVideo.thumbnailKey) {
            const utapi = new UTApi()
            
            await utapi.deleteFiles(existingVideo.thumbnailKey)
            await db
            .update(videos)
            .set({thumbnailKey:null , thumbnailUrl:null})
            .where(and(
              eq(videos.id, input.id),
              eq(videos.userId, userId)
            ))
          }
        if(!existingVideo.muxPlayBackId) {
            throw new TRPCError({code: "BAD_REQUEST"})
        }
        const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlayBackId}/thumbnail.jpg`;
        const utapi = new UTApi()
        const uploadedThumnail = await utapi.uploadFilesFromUrl(tempThumbnailUrl)
        if(!uploadedThumnail.data) {
            throw new TRPCError({code: "INTERNAL_SERVER_ERROR"})
        }
        const {key: thumbnailKey , url: thumbnailUrl} = uploadedThumnail.data
        const [updateVideo] = await db
            .update(videos)
            .set({thumbnailUrl,thumbnailKey})
            .where(and(
                eq(videos.id, input.id),
                eq(videos.userId, userId)
            ))
            .returning()
        return updateVideo
    }),
    remove: protectedProduce
    .input(z.object({id:z.string().uuid()}))
    .mutation(async ({ctx, input}) => {
        const {id:userId} = ctx.user
        const [removedVideo] = await db
        .delete(videos)
        .where(and(
            eq(videos.id, input.id),
            eq(videos.userId, userId)
        ))
        .returning()
        if(!removedVideo) {
            throw new TRPCError({code: "NOT_FOUND"})
        }
        return removedVideo
    }),
    upadate: protectedProduce
    .input(videoUpdateSchema)
    .mutation(async ({ctx,input}) => {
        const {id:userId} = ctx.user

        if(!input.id) {
            throw new TRPCError({code: "BAD_REQUEST"})
        }
        const [updateVideo] = await db
        .update(videos)
        .set({
            title: input.title,
            description: input.description,
            categoryId: input.categoryId,
            visibility: input.visibility,
            updateAt: new Date()
        })
        .where(and(eq(videos.id,input.id),eq(videos.userId,userId)))
        .returning()
        if(!updateVideo) {
            throw new TRPCError({code: "NOT_FOUND"})
        }
        return updateVideo
    }),
    create: protectedProduce.mutation(async ({ctx}) => {
        const {id: userId } = ctx.user;
        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: userId,
                playback_policies:["public"],
                input: [
                    {
                        generated_subtitles: [
                            {
                                language_code: 'en',
                                name: "English"
                            }
                        ]
                    }
                ]
            },
            cors_origin: "*"
        })
        const [video] = await db
            .insert(videos)
            .values({
                userId,
                title: "Untitled",
                muxStatus: "waiting",
                
                muxUploadId: upload.id,
                
            })
            .returning()
        return {
            video:video,
            url: upload.url
        }
    })

})