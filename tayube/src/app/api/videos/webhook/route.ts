import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
  VideoAssetDeletedWebhookEvent,
} from '@mux/mux-node/resources/webhooks';
import { mux } from '@/lib/mux';
import { videos } from '@/db/schema';
import { db } from '@/db';
import { UTApi } from 'uploadthing/server';

const SIGNING_SECRECT = process.env.MUX_WEBHOOK_SECRECT!;
type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetTrackReadyWebhookEvent
  | VideoAssetDeletedWebhookEvent

export const POST = async (request: Request) => {
  if (!SIGNING_SECRECT) {
    throw new Error('MUX_WEBHOOK_SECRECT is not set ');
  }
  const headersPayload = await headers();
  const muxSignature = headersPayload.get('mux-signature');


  if (!muxSignature) {
    return new Response('No signature found', { status: 401 });
  }

  const payload = await request.json();
  const body = JSON.stringify(payload);

  mux.webhooks.verifySignature(
    body,
    {
      "mux-signature": muxSignature,
    },
    SIGNING_SECRECT
  );
  switch (payload.type as WebhookEvent['type']) {
    case 'video.asset.created': {
      const data = payload.data as VideoAssetCreatedWebhookEvent['data'];
      if (!data.upload_id) {
        return new Response('No upload id fonud', { status: 400 });
      }
      await db
        .update(videos)
        .set({
          muxAssetId: data.id,
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }
    case 'video.asset.ready': {
      const data = payload.data as VideoAssetReadyWebhookEvent["data"]
      const playbackId = data.playback_ids?.[0]?.id
      if(!data.upload_id) {
        return new Response("Missing upload ID", {status:400})
      }

      if(!playbackId) {
        return new Response("Missing playback Id", {status: 400})
      }
      const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
      const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
      const duration = data.duration ? Math.round(data.duration * 1000) : 0
      const utapi = new UTApi()
      const [uploadedThumnail, uploadedPreview] = await utapi.uploadFilesFromUrl([
        tempThumbnailUrl,
        tempPreviewUrl,
      ])

      if(!uploadedThumnail.data || !uploadedPreview.data) {
        return new Response("Fail to upload thumnail", {status:500})
      }

      const {key:thumbnailKey, url:thumbnailUrl} = uploadedThumnail.data;
      const {key:previewkey, url:previewUrl} = uploadedPreview.data;

      await db 
      .update(videos)
      .set({
        muxStatus: data.status,
        muxPlayBackId: playbackId,
        muxAssetId: data.id,
        thumbnailUrl,
        thumbnailKey,
        previewkey,
        previewUrl,
        duration
      })
      .where(eq(videos.muxUploadId, data.upload_id))
      break
    }
    case "video.asset.errored": {
      const data = payload.data as VideoAssetErroredWebhookEvent["data"]
      if (!data.upload_id) {
        return new Response('No upload id fonud', { status: 400 });
      }
      await db 
      .update(videos)
      .set({
        muxStatus: data.status
      })
      .where(eq(videos.muxUploadId,data.upload_id))
      break
    }
    case "video.asset.deleted": {
      const data = payload.data as VideoAssetDeletedWebhookEvent["data"]
      if (!data.upload_id) {
        return new Response('No upload id fonud', { status: 400 });
      }
      await db
      .delete(videos)
      .where(eq(videos.muxUploadId, data.upload_id))
      break
    }
    case "video.asset.track.ready": {
      
      
      const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
        asset_id: string
      }

      const assetId = data.asset_id
      const trackId = data.id
      const status = data.status
      
      if(!assetId) {
        return new Response("Missing upload ID", {status: 400})
      }
      await db
      .update(videos)
      .set({
        muxTrackId: trackId,
        muxTrackStatus: status
      })
      .where(eq(videos.muxAssetId,assetId))

      break
    }


  }
  return new Response('webhook received', { status: 200 });
 
};
