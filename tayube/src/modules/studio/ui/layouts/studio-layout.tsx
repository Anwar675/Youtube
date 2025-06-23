import { SidebarProvider } from '@/components/ui/sidebar';
import {  StudioNabar } from '../components/studio_navbar';
import {  StudioSidbar } from '../components/studio_sidebar';



interface StudioProps {
  children: React.ReactNode;
}

export const StudioLayout = ({ children }: StudioProps) => {
  return (
    <SidebarProvider>
      <div className="w-full">
        <StudioNabar />
        <div className="flex min-h-screen pt-[4rem]">
          <StudioSidbar />
          <main className='flex-1 overflow-y-auto'>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
