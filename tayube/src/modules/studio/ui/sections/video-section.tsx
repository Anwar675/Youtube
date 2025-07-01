'use client';

import { DEFAULT_LIMIT } from '@/constans';
import { trpc } from '@/trpc/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { InfinitineSroll } from '@/components/infinite-scroll';
import {format} from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';
import { VideoThhumbnail } from '@/modules/videos/server/ui/components/videos-thumbnail';
import { snakeCaseToTitle } from '@/lib/utils';
import { Globe2Icon, LockIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const VideoSection = () => {
  return (
    <Suspense fallback={<VideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error..</p>}>
        <VideoSectionSupense />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSectionSkeleton = () => {
  return (
    <>
      <div className='border-y'> 
        <Table>
            <TableHeader>
              <TableRow className='hover:bg-gray-200 cursor-pointer'>
                <TableHead className="pl-6 w-[510px]">Video</TableHead>
                <TableHead>Visibily</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Comment</TableHead>
                <TableHead className="text-right pr-6 ">Likes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody> 
              {Array.from({length:5}).map((_,index) => (
                <TableRow key={index}>
                    <TableCell className='pl-6'>
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-20 w-36" />
                          <div className='flex flex-col gap-2'>
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-3 w-[150px]" />
                          </div>
                        </div>
                    </TableCell>
                    <TableCell><Skeleton className='h-4 w-20'/></TableCell>
                    <TableCell><Skeleton className='h-4 w-16'/></TableCell>
                    <TableCell><Skeleton className='h-4 w-24'/></TableCell>
                    <TableCell className='text-right' ><Skeleton className='h-4 w-12 ml-auto'/></TableCell>
                    <TableCell className='text-right' ><Skeleton className='h-4 w-12 ml-auto'/></TableCell>
                    <TableCell className='text-right' ><Skeleton className='h-4 w-12 ml-auto'/></TableCell>                 
                </TableRow>
              ))}          
            </TableBody>
        </Table>
      </div>
    </>
  )
}


const VideoSectionSupense = () => {
  const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage: {
        nextCursor: { id: string; updateAt: Date } | null;
      }) => lastPage.nextCursor,
    }
  );
  return (
    <div>
      <div className="border-y">
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-gray-200 cursor-pointer'>
              <TableHead className="pl-6 w-[510px]">Video</TableHead>
              <TableHead>Visibily</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Comment</TableHead>
              <TableHead className="text-right pr-6 ">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.pages
              .flatMap((page) => page.items)
              .map((video) => (
                <Link href={`/studio/videos/${video.id}`} key={video.id} legacyBehavior>
                  <TableRow className="cursor-pointer">
                    <TableCell>
                      <div className='flex items-center gap-4'>
                        <div className='relative aspect-video w-36 shrink-0'>
                          <VideoThhumbnail imageUrl={video.thumbnailUrl} previewUrl={video.previewUrl} duration={video.duration || 0}  title={video.title} />
                        </div>
                        <div className='flex flex-col overflow-hidden gap-y-1'>
                          <span className='text-sm line-clamp-1'>{video.title}</span>
                          <span className='text-sm text-muted-foreground'>{video.description || "no description"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center'>
                        {video.visibility === "private" ? (
                          <LockIcon className='size-4 mr-2' />
                        ): (
                          <Globe2Icon className='size-4 mr-2' />
                        )}
                        {snakeCaseToTitle(video.visibility)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center'>
                        {snakeCaseToTitle(video.muxStatus || "error")}
                      </div>
                    </TableCell>
                    <TableCell className='text-sm truncate'>
                      {format(new Date(video.createAt), "d MM yyyy")}
                    </TableCell>
                    <TableCell className='text-right text-sm'>Views</TableCell>
                    <TableCell className='text-right text-sm'>Comment</TableCell>
                    <TableCell className='text-right text-sm'>Likes</TableCell>
                  </TableRow>
                </Link>
              ))}
          </TableBody>
        </Table>
      </div>
      <InfinitineSroll
        isManual
        hasNextPage={query.hasNextPage}
        isFetchingNextpage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};
