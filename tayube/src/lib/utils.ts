import { clsx, type ClassValue } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDuration = (duration:number) => {
  const seconds = Math.floor((duration % 60000)/1000)
  const minutes = Math.floor((duration /60000 ))
  return `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`
}

export const snakeCaseToTitle = (str: string) => {
  return str.replace(/_/g, " ").replace(/\b\w/g, (char) =>char.toUpperCase())
}

export const formatTime = (date: Date | number) => {
  return formatDistanceToNow(date, {
    addSuffix: false,
    locale: vi,
  }).replace(/^khoảng\s*/i, '');
} 