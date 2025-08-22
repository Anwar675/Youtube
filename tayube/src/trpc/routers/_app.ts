import {  createTRPCRouter } from '../init';
import { userRouter } from '@/modules/users/server/procedure';
import { studioRouter } from '@/modules/studio/server/procedure';
import { searchRouter } from '@/modules/search/server/procedure';
import { videosRouter } from '@/modules/videos/server/procedures';
import { commentRouter } from '@/modules/comments/server/procedures';
import { playlistRouter } from '@/modules/playlist/server/procedures';
import { suggestionRouter } from '@/modules/suggestions/server/procedure';
import { categoriesRouter } from '@/modules/categories/server/procedures';
import { videoViewsRouter } from '@/modules/video-views/server/procedures';
import { SubcriptionsRouter } from '@/modules/subscriptions/server/procedures';
import { videoReactionsRouter } from '@/modules/video-reactions/server/procedures';
import { commentReactionsRouter } from '@/modules/comment-reactions/server/procedures';



export const appRouter = createTRPCRouter({
  
  studio: studioRouter,
  categories:categoriesRouter,
  search: searchRouter,
  playlist: playlistRouter,
  comments: commentRouter,
  videos: videosRouter,
  users: userRouter,
  videoViews: videoViewsRouter,
  videoReactions: videoReactionsRouter,
  subscriptions: SubcriptionsRouter,
  commentReactions: commentReactionsRouter,
  suggestions: suggestionRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;