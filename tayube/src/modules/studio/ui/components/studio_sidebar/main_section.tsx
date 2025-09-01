'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

import { useAuth, useClerk } from '@clerk/nextjs';
import { HomeIcon, PlaySquare, Scissors } from 'lucide-react';
import Link from 'next/link';

const items = [
  {
    title: 'Home',
    url: '/',
    icon: HomeIcon,
  },
  {
    title: 'Shorts',
    url: '/shorts',
    icon: Scissors,
    
  },
  {
    title: 'Subscriptions',
    url: '/feed/subscriptions',
    icon: PlaySquare,
    auth: true,
  },
];

export const MainSection = () => {
  const clerk = useClerk()
  const {isSignedIn} = useAuth()
  
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="flex gap-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                variant="hover"
                tooltip={item.title}
                asChild
                isActive={false}
                onClick={(e) => {
                  if(!isSignedIn && item.auth) {
                    e.preventDefault()
                    return clerk.openSignIn()
                  }
                }}
              >
                <Link
                  href={item.url}
                  className="flex text-white items-center py-5 gap-8"
                >
                  <item.icon size={32} />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
