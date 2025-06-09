'use client';

import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface FilterCarouselProps {
  value?: string | null;
  isLoading?: boolean;
  onSelect: (value: string | null) => void;
  data?: {
    value: string;
    label: string;
  }[];
}

export const FilterCarousel = ({
  value,
  isLoading,
  data,
  onSelect,
}: FilterCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <div className="relative w-full">
      {/* Left fade */}
      <div
        className={cn(
          'absolute left-8 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none',
          current === 1 && 'hidden'
        )}
      />
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          dragFree: true,
        }}
        className="w-full px-8"
      >
        <CarouselContent className="-ml-3">
          {!isLoading && (
            <CarouselItem onClick={() => onSelect(null)} className="pl-5 basis-auto">
              <Badge
                className=" px-3 py-1 rounded-lg  cursor-pointer whitespace-nowrap text-sm"
                variant={!value  ? 'secondary' : 'default'}
              >
                All
              </Badge>
            </CarouselItem>
          )}
          {isLoading &&
            Array.from({ length: 14 }).map((_, index) => (
              <CarouselItem key={index} className="pl-3 basis-auto">
                <Skeleton className="rounded-lg bg-[#272727] px-3 py-1 h-full text-sm w-[100px] font-semibold">
                  &nbsp;
                </Skeleton>
              </CarouselItem>
            ))}
          {!isLoading &&
            data?.map((item) => (
              <CarouselItem
                key={item.value}
                className="pl-3 basis-auto cursor-pointer"
                onClick={() => onSelect(item.value)}
              >
                <Badge variant={value === item.value ? "secondary" : "default"} className="px-3 py-1">{item.label}</Badge>
              </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="bg-inherit left-0 z-20" />
        <CarouselNext className="bg-inherit right-0 z-20" />
      </Carousel>
      <div
        className={cn(
          'absolute right-8 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-gray-800 to-transparent pointer-events-none',
          current === count && 'hidden'
        )}
      />
    </div>
  );
};
