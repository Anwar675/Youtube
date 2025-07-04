import { db } from "@/db";
import { videos, videoUpdateSchema } from "@/db/schema";
import { mux } from "@/lib/mux";
import {z} from "zod"
import { createTRPCRouter, protectedProduce } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";


export const videosRouter = createTRPCRouter({
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