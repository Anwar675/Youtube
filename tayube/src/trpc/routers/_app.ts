import { categoriesRouter } from '@/modules/categories/server/procedures';
import {  createTRPCRouter } from '../init';
import { studioRouter } from '@/modules/studio/server/procedure';
import { videosRouter } from '@/modules/videos/server/procedures';
import { videoViewsRouter } from '@/modules/video-views/server/procedures';
import { videoReactionsRouter } from '@/modules/video-reactions/server/procedures';
import { SubcriptionsRouter } from '@/modules/subscriptions/server/procedures';
import { commentRouter } from '@/modules/comments/server/procedures';
import { commentReactionsRouter } from '@/modules/comment-reactions/server/procedures';
import { suggestionRouter } from '@/modules/suggestions/server/procedure';



export const appRouter = createTRPCRouter({
  
  studio: studioRouter,
  categories:categoriesRouter,
  comments: commentRouter,
  videos: videosRouter,
  videoViews: videoViewsRouter,
  videoReactions: videoReactionsRouter,
  subscriptions: SubcriptionsRouter,
  commentReactions: commentReactionsRouter,
  suggestions: suggestionRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;