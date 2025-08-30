import { redirect } from "next/navigation";

export const metadata = {
  title: "Shorts - Tayube",
  description: "Xem các video ngắn thú vị",
};

export default async function ShortsPage() {
 
  redirect("/");
}
