import { integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {createInsertSchema,createUpdateSchema,createSelectSchema} from "drizzle-zod"
import { z } from "zod";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    createAt: timestamp("create_at").defaultNow().notNull(),
    updateAt: timestamp("update_at").defaultNow().notNull()
},(t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)])

export const categoryRelations = relations(users, ({many}) => ({
    videos:many(videos)
}))

export const categories = pgTable("categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("desription"),
    createAt: timestamp("create_at").defaultNow().notNull(),
    updateAt: timestamp("update_at").defaultNow().notNull()
}, (t) => [uniqueIndex("name_idx").on(t.name)])

export const videoVisibility = pgEnum("video_visibility", [
    "private",
    "public"
])

export const videos = pgTable("videos", {
    id:uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    muxStatus: text("mux_status"),
    muxAssetId: text("mux_asset_id").unique(),
    muxUploadId: text("mux_upload_id").unique(),
    muxPlayBackId: text("mux_playback_id").unique(),
    muxTrackId: text("mux_track_id").unique(),
    muxTrackStatus: text("mux_track_status"),
    thumbnailUrl:text("thumbnail_url"),
    thumbnailKey: text("thumbnail_key"),
    duration: integer("duration").default(0).notNull(),
    visibility:videoVisibility("visibility").default("private").notNull(),
    previewUrl: text("preview_url"),
    previewkey: text("preview_key"),
    categoryId: uuid("category_id").references(() => categories.id, {
        onDelete:"set null"
    }),
    userId: uuid("user_id").references(() => users.id, {
        onDelete: "cascade"
    }).notNull(),
    createAt: timestamp("create_at").defaultNow().notNull(),
    updateAt: timestamp("updateAt").defaultNow().notNull()
})

export const videoInsertSchema = createInsertSchema(videos) as unknown as z.ZodType;
export const videoUpdateSchema = createUpdateSchema(videos)  as unknown as z.ZodType;;
export const videoSelectSchema = createSelectSchema(videos)  as unknown as z.ZodType;

export const videoRelations = relations(videos, ({one})=> ({
    user: one(users, {
        fields: [videos.userId],
        references: [users.id]
    }),
    category: one(categories, {
        fields: [videos.categoryId],
        references: [categories.id]
    }),
}))