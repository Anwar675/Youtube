import { redirect } from "next/navigation";
import { trpc } from "@/trpc/server";

export const metadata = {
  title: "Shorts - Tayube",
  description: "Xem các video ngắn thú vị",
};

export default async function ShortsPage() {
  // Fetch the first short video to redirect to
  const shortsData = await trpc.videos.getShorts({ limit: 1 });
  
  if (shortsData.items && shortsData.items.length > 0) {
    const firstShortId = shortsData.items[0].id;
    redirect(`/shorts/${firstShortId}`);
  }

  // If no shorts available, show message
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500">Không có shorts nào</p>
    </div>
  );
}
