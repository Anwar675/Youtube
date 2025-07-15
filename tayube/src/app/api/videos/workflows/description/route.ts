import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs"
import { and, eq } from "drizzle-orm";


interface InputType {
  userId: string;
  videoId: string
}

const DESCRIPTION_SYSTEM = `Nhiệm vụ của bạn Là tóm tắt bản ghi video vui lòng làm theo những bước sau:

- Ngắn gọn, tóm tắt nội dung thành một bản tóm tắt nắm bắt được nhưungx điểm chính và ý tưởng chính mà không bỏ sót chi tiết quan trọng
- Tránh sử dụng thuật ngữ chuyên ngành hoặc ngôn ngữ quá phức tạp trừ khi nó hỗ trợ khả năng tìm kiếm
- tập trung vào thông tin quan trọng nhất, bỏ qua những thông tin thừa lặp lại và không liên quan
- Đảm bảo tiêu đề dài từ 5-10 từ mà không quá 100 ký tự 
- Chỉ trả về bản tóm tắt, không trả về bất kì văn bản, chú thích hoặc bình luận nào khác  `

export const { POST } = serve(
  async (context) => {
    const input = context.requestPayload as InputType
    const {userId, videoId} = input 

    const video = await context.run("get-video", async () => {
      const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(
        eq(videos.id, videoId),
        eq(videos.userId, userId )
      ))
      if(!existingVideo) {
        throw new Error("NOT_FOUND")
      }
      return existingVideo
    })
    
    const transript = await context.run("get-transript", async () => {
      const trackUrl = `https://stream.mux.com/${video.muxPlayBackId}/text/${video.muxTrackId}.txt`
      const response= await fetch(trackUrl)
      const text = response.text()
      if(!text) {
        throw new Error("Bad request")
      }
      return text
    })

    const {body} = await context.api.openai.call(
      "Generate-description",
      {
        token: process.env.OPENAI_API_KEY!,
        operation: "chat.completions.create",
        body: {
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: DESCRIPTION_SYSTEM,
            },
            {
              role: "user",
              content: transript
            }
          ],
        },
      }
    )
    console.log("OpenAI raw response:", JSON.stringify(body, null, 2));
    const description = body.choices[0]?.message.content
    console.log({video})
    await context.run("update-video", async () => {
      await db
      .update(videos)
      .set({
        description: description || video.description
      })
      .where(and(
        eq(videos.id, video.id),
        eq(videos.userId,video.userId)
      ))
    })

    
  }
)