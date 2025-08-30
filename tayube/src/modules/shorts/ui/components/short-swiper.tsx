"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Virtual, Pagination, Navigation, Mousewheel } from 'swiper/modules';
import { trpc } from "@/trpc/client";
import { VideoPlayer } from "@/modules/videos/server/ui/components/video-player";
import { VideoReactions } from "@/modules/videos/server/ui/components/video-reaction";

import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { MessageCircle, Share2, MoreVertical, Play, Pause } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Import Swiper CSS
import 'swiper/css';
import 'swiper/css/virtual';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/mousewheel';
import { UserAvata } from "@/components/user-avatar";

interface ShortSwiperProps {
  initialShortId?: string;
}

export const ShortSwiper = ({ initialShortId }: ShortSwiperProps) => {
  const { isSignedIn } = useAuth();
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const utils = trpc.useUtils();
  
  // Fetch shorts data
  const { data: shortsData, isLoading } = trpc.videos.getShorts.useQuery(
    { limit: 20 },
    {
      refetchOnWindowFocus: false,
    }
  );

  const createView = trpc.videoViews.create.useMutation({
    onSuccess: () => {
      if (currentVideoId) {
        utils.videos.getOne.invalidate({ id: currentVideoId });
        utils.videos.getShorts.invalidate()
      }
    }
  });

  const handleSlideChange = (swiper: any) => {
    const currentIndex = swiper.activeIndex;
    const newVideoId = shortsData?.items[currentIndex]?.id;
    
    if (newVideoId && newVideoId !== currentVideoId) {
      // Pause current video if exists
      const currentVideo = document.querySelector(`video[data-video-id="${currentVideoId}"]`) as HTMLVideoElement;
      if (currentVideo) {
        currentVideo.pause();
        setIsPlaying(false);
      }
      
      setCurrentVideoId(newVideoId);
      
      // Create view for new video
      if (!isSignedIn) {
        createView.mutate({ videoId: newVideoId });
      }
    }
  };


  useEffect(() => {
    if (shortsData?.items?.[0]?.id) {
      setCurrentVideoId(shortsData.items[0].id);
    }
  }, [shortsData]);

  if (isLoading || !shortsData?.items) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (shortsData.items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Không có shorts nào</p>
      </div>
    );
  }



  return (
    <div className="h-screen w-full bg-black overflow-hidden">
      <Swiper
        direction="vertical"
        modules={[Virtual, Pagination, Navigation, Mousewheel]}
        spaceBetween={0}
        slidesPerView={1}
        virtual
        mousewheel={{ 
          forceToAxis: true, 
          releaseOnEdges: false,
          sensitivity: 1,
          thresholdDelta: 50
        }}
        onSlideChange={handleSlideChange}
        className="h-full w-full"
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={false}
        allowTouchMove={true}
        resistance={false}
       
      >
        {shortsData.items.map((short, index) => (
          <SwiperSlide key={short.id} virtualIndex={index} className="flex items-center justify-center">
            <div className="relative w-full h-full flex  items-center justify-center">
              {/* Video Player */}
              <div className="relative w-full max-w-md  aspect-[9/16] bg-black rounded-lg overflow-hidden">
                <VideoPlayer
                  autoPlay={short.id === currentVideoId}
                  onPlay={() => {
                    setIsPlaying(true);
                    if (isSignedIn) {
                      createView.mutate({ videoId: short.id });
                    }
                  }}
                  playbackId={short.muxPlayBackId}
                  thumbnailUrl={short.thumbnailUrl}
                  data-video-id={short.id}
                />
              
              </div>

              {/* Right Side Actions */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-4">
                {/* VideoReactions Component - Sử dụng component có sẵn */}
                <VideoReactions 
                  videoId={short.id}
                  likes={short.likeCount || 0}
                  dislikes={short.dislikeCount || 0}
                  viewerReaction={short.viewerReaction}
                  
                  isMobile={true}  
                />

                {/* Comment Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black bg-opacity-50 text-white hover:bg-opacity-70 rounded-full w-12 h-12 p-0 flex flex-col gap-1"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-xs">Bình luận</span>
                </Button>

                {/* Share Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black bg-opacity-50 text-white hover:bg-opacity-70 rounded-full w-12 h-12 p-0 flex flex-col gap-1"
                >
                  <Share2 className="h-5 w-5" />
                  <span className="text-xs">Chia sẻ</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="bg-black bg-opacity-50 text-white hover:bg-opacity-70 rounded-full w-12 h-12 p-0 flex flex-col gap-1"
                >
                  <Share2 className="h-5 w-5" />
                  {short.viewCount}
                </Button>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-4 left-4 right-20 text-white">
                <h3 className="font-bold text-lg mb-2">{short.title}</h3>
                
                {/* User Info */}
                <div className="flex items-center space-x-3">
                  <UserAvata size="lgg" imageUrl={short.user.imageUrl || '/user-logo.svg'} name={short.user.name || "User"} />
                </div>

                {/* Description */}
                {short.description && (
                  <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                    {short.description}
                  </p>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
    </div>
  );
};
