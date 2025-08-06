import { integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid , primaryKey, foreignKey} from "drizzle-orm/pg-core";
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



export const userRelations = relations(users, ({many}) => ({
    videos: many(videos),
    videoViews: many(videoViews),
    videoReactions: many(videoReactions),
    subscriptions: many(subscriptions, {
        relationName: "subscriptions_viewer_id_fkey"
    }),
    subscribers: many(subscriptions, {
        relationName: "subscriptions_creator_id_fkey"
    }),
    comments: many(comments),
    commentReactions: many(commentReactions)
}))

export const subscriptions = pgTable("subscriptions", {
    viewerId: uuid("viewer_id").references(() => users.id, {onDelete: "cascade"}).notNull(),
    creatorId: uuid("creator_id").references(() => users.id, {onDelete: "cascade"}).notNull(),
    createAt: timestamp("create_at").defaultNow().notNull(),
    updateAt: timestamp("update_at").defaultNow().notNull(),
}, (t) => [
    primaryKey({
        name:"subscriptions_pk",
        columns: [t.viewerId, t.creatorId]
    })
])

export const subscriptionsRelations = relations(subscriptions, ({one}) => ({
    viewer: one(users, {
        fields: [subscriptions.viewerId],
        references: [users.id],
        relationName: "subscriptions_viewer_id_fkey"
    }),
    creator: one(users, {
        fields: [subscriptions.creatorId],
        references: [users.id],
        relationName: "subscriptions_creator_id_fkey"
    })
}))

export const reactionType = pgEnum("react_type", ["like", "dislike"])


export const categories = pgTable("categories", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("desription"),
    createAt: timestamp("create_at").defaultNow().notNull(),
    updateAt: timestamp("update_at").defaultNow().notNull()
}, (t) => [uniqueIndex("name_idx").on(t.name)])

export const categoryRelations = relations(users, ({many}) => ({
    videos:many(videos)
}))

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
    updateAt: timestamp("update_at").defaultNow().notNull()
})

export const videoInsertSchema = createInsertSchema(videos) as unknown as z.ZodType;
export const videoUpdateSchema = createUpdateSchema(videos)  as unknown as z.ZodType;;
export const videoSelectSchema = createSelectSchema(videos)  as unknown as z.ZodType;

export const videoRelations = relations(videos, ({one, many})=> ({
    user: one(users, {
        fields: [videos.userId],
        references: [users.id]
    }),
    category: one(categories, {
        fields: [videos.categoryId],
        references: [categories.id]
    }),
    views: many(videoViews),
    reactions:  many(videoReactions),
    comments: many(comments)
}))

export const comments = pgTable("comments", {
    id: uuid("id").primaryKey().defaultRandom(),
    parentId: uuid("parent_id"),
    userId: uuid("user_id").references(() => users.id, {onDelete: "cascade"}).notNull(),
    videoId: uuid("video_id").references(() => videos.id, {onDelete: "cascade"}).notNull(),
    value: text('value').notNull(),
    createAt: timestamp("create_at").defaultNow().notNull(),
    updateAt: timestamp("update_at").defaultNow().notNull(),
}, (t) => {
    return [
        foreignKey({
            columns: [t.parentId],
            foreignColumns: [t.id],
            name: "comment_parent_id_key"
        })
        .onDelete("cascade")
    ]
})
      
export const commentRelations = relations(comments,  ({one, many}) => ({
    user:one(users, {
        fields: [comments.userId],
        references: [users.id]
    }),
    video:one(videos, {
        fields: [comments.videoId],
        references: [videos.id]
    }),
    parent:one(comments, {
        fields: [comments.parentId],
        references: [comments.id],
        relationName: "comments_parent_id_fkey"
    }),
    reaction: many(commentReactions),
    replies: many(comments, {
        relationName: "comments_parent_id_fkey"
    })
}))

export const commentSelectSchema = createSelectSchema(comments) as unknown as z.ZodType;
export const commentInsertSchema = createInsertSchema(comments) as unknown as z.ZodObject<any>
export const commentUpdateSchema = createUpdateSchema(comments)


export const commentReactions = pgTable("comment_reactions", {
    userId: uuid("user_id").references(() => users.id, {onDelete: "cascade"}).notNull(),
    commentId: uuid("comment_id").references(() => comments.id, {onDelete: "cascade"}).notNull(),
    type: reactionType("type").notNull(),
    createAt: timestamp("create_at").defaultNow().notNull(),
    updateAt: timestamp("update_at").defaultNow().notNull(),
},(t) => [
    primaryKey({
        name:"comment_reactions_pk",
        columns: [t.userId, t.commentId]
    })
])

export const commentReactionRelations = relations(commentReactions, ({one}) => ({
    users: one(users, {
        fields: [commentReactions.userId],
        references: [users.id]
    }),
    comments: one(comments, {
        fields: [commentReactions.commentId],
        references: [comments.id]
    })
}))

export const videoViews = pgTable("video_views", {
    userId: uuid("user_id").references(() => users.id, {onDelete: "cascade"}).notNull(),
    videoId: uuid("video_id").references(() => videos.id, {onDelete: "cascade"}).notNull(),
    createAt: timestamp("create_at").defaultNow().notNull(),
    updateAt: timestamp("update_at").defaultNow().notNull(),
}, (t) => [
    primaryKey({
        name:"video_views_pk",
        columns: [t.userId, t.videoId]
    })
])

export const videoViewRelations = relations(videoViews, ({one}) => ({
    users: one(users, {
        fields: [videoViews.userId],
        references: [users.id]
    }),
    videos: one(videos, {
        fields: [videoViews.videoId],
        references: [videos.id]
    }),
  
    
}))

export const videoViewSelectSchema = createSelectSchema(videoViews)
export const videoViewInsertSchema = createInsertSchema(videoViews)
export const videoViewUpdateSchema = createUpdateSchema(videoViews)




export const videoReactions = pgTable("video_reactions", {
    userId: uuid("user_id").references(() => users.id, {onDelete: "cascade"}).notNull(),
    videoId: uuid("video_id").references(() => videos.id, {onDelete: "cascade"}).notNull(),
    type: reactionType("type").notNull(),
    createAt: timestamp("create_at").defaultNow().notNull(),
    updateAt: timestamp("update_at").defaultNow().notNull(),
}, (t) => [
    primaryKey({
        name:"video_reactions_pk",
        columns: [t.userId, t.videoId]
    })
])

export const videoReactionRelations = relations(videoReactions, ({one}) => ({
    users: one(users, {
        fields: [videoReactions.userId],
        references: [users.id]
    }),
    videos: one(videos, {
        fields: [videoReactions.videoId],
        references: [videos.id]
    })
}))

export const videoReactionSelectSchema = createSelectSchema(videoReactions)
export const videoReactionInsertSchema = createInsertSchema(videoReactions)
export const videoReactionUpdateSchema = createUpdateSchema(videoReactions)