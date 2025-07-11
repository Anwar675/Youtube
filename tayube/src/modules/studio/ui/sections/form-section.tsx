'use client';

import { Button } from '@/components/ui/button';
import { trpc } from '@/trpc/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import {
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  ImagePlusIcon,
  LockIcon,
  MoreVerticalIcon,
  RotateCcwIcon,
  SparklesIcon,
  TrashIcon,
} from 'lucide-react';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { videoUpdateSchema } from '@/db/schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { VideoPlayer } from '@/modules/videos/server/ui/components/video-player';
import Link from 'next/link';
import { snakeCaseToTitle } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { THUMNAIL_FALLBACK } from '@/modules/videos/constans';
import { ThumnailUploadModal } from '../components/thumnail-upload-modles';

interface FormSectionProps {
  videoId: string;
}

export const FormSection = ({ videoId }: FormSectionProps) => {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <FormSectionSucspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const FormSectionSkeleton = () => {
  return <p>Loading...</p>;
};

const FormSectionSucspense = ({ videoId }: FormSectionProps) => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
  const [categories] = trpc.categories.getMany.useSuspenseQuery();
  const [thumnailModalopen, setThumnailModalopen] = useState(false)
  const update = trpc.videos.upadate.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId });
      toast.success('Video Updated');
    },
    onError: () => {
      toast.error('something went wrong');
    },
  });
  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success('Video removed');
      router.push('/studio');
    },
    onError: () => {
      toast.error('something went wrong');
    },
  });
  const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({id: videoId});
      toast.success('Thumnail restored');
    },
    onError: () => {
      toast.error('something went wrong');
    },
  });

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  });

  const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
    update.mutateAsync(data);
  };
  const fullUrl = `${
    process.env.VERCEL_URL || 'http://localhost:3000 '
  }/videos/${videoId}`;
  const [isCopy, setIsCopy] = useState(false);
  const onCopy = async () => {
    navigator.clipboard.writeText(fullUrl);
    setIsCopy(true);
    setTimeout(() => {
      setIsCopy(false);
    }, 2000);
  };
  return (
    <>
    <ThumnailUploadModal open={thumnailModalopen} videoId={videoId} onOpenChange={setThumnailModalopen} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl  font-bold">Video details</h1>
              <h1 className="text-xs text-muted-foreground">
                Manage your video details
              </h1>
            </div>
            <div className="flex items-center gap-x-2">
              <Button type="submit" variant="new" disabled={update.isPending}>
                Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="z-10">
                  <DropdownMenuItem
                    className="flex items-center bg-gray-800 p-2 mt-3 cursor-pointer "
                    onClick={() => remove.mutate({ id: videoId })}
                  >
                    <TrashIcon className="size-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="space-y-8 lg:col-span-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Add a new title to your video "
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ''}
                        rows={10}
                        className="resize-none pr-10"
                        placeholder="Add a new description to your video "
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="thumnailUrl"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Thumnail</FormLabel>
                    <FormControl>
                      <div className="p-0.5 border  border-neutral-400 relative h-[84px] w-[153px] group">
                        <Image
                          fill
                          src={video.thumbnailUrl ?? THUMNAIL_FALLBACK}
                          className="object-cover"
                          alt="Thumbnai"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              size="icon"
                              className="bg-black/50 hover:bg-black/60 absolute top-1 right-1 
                          rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 duration-300 size-4 "
                            >
                              <MoreVerticalIcon className="text-white" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="start"
                            side="right"
                            className="hover:border-none cursor-pointer"
                          >
                            <DropdownMenuItem onClick={() => setThumnailModalopen(true)} className="flex p-1   ml-2 hover:bg-gray-500 items-center bg-[#282828] ">
                              <ImagePlusIcon className="size-3 mr-2" />
                              Change
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex p-1   ml-2 hover:bg-gray-500 items-center bg-[#282828] ">
                              <SparklesIcon className="size-3 mr-2" />
                              AI-Generated
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => restoreThumbnail.mutate({id: videoId})} className="flex p-1   ml-2 hover:bg-gray-500 items-center bg-[#282828] ">
                              <RotateCcwIcon className="size-3 mr-2" />
                              Restore
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a categoryId" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-y-8 lg:col-span-2">
              <div className="flex flex-col gap-4 bg-[#434453] rounded-xl overflow-hidden h-fit">
                <div className="aspect-video overflow-hidden relative">
                  <VideoPlayer
                    playbackId={video.muxPlayBackId}
                    thumbnailUrl={video.thumbnailUrl}
                  />
                </div>
                <div className="p-4 flex flex-col gap-y-6">
                  <div className="flex justify-between items-center gap-x-2">
                    <p className="text-white text-xs">Video link</p>
                    <div className="flex items-center gap-x-2">
                      <Link href={`/videos/${video.id}`}>
                        <p className="line-clamp-1 text-sm text-blue-500">
                          http://localhost:3000/12323
                        </p>
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={onCopy}
                        disabled={isCopy}
                      >
                        {isCopy ? <CopyCheckIcon /> : <CopyIcon />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-gray-400 text-xs">Video status</p>
                      <p>{snakeCaseToTitle(video.muxStatus || 'preparing')}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className="text-gray-400 text-xs">SubTitles status</p>
                      <p>
                        {snakeCaseToTitle(video.muxTrackStatus || 'no_subtitles')}
                      </p>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visibility</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ?? undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a categoryId" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="public">
                              <div className="flex items-center">
                                <Globe2Icon className="size-4 mr-2" />
                                Public
                              </div>
                            </SelectItem>
                            <SelectItem value="private">
                              <div className="flex items-center">
                                <LockIcon className="size-4 mr-2" />
                                Private
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
