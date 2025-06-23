import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetTrackErroredWebhookEvent,
} from '@mux/mux-node/resources/webhooks';
import { mux } from '@/lib/mux';
import { videos } from '@/db/schema';
import { db } from '@/db';

const SIGNING_SECRECT = process.env.MUX_WEBHOOK_SECRECT!;
type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetTrackErroredWebhookEvent;

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
      if(!playbackId) {
        return new Response("Missing playback Id", {status: 400})
      }
      const thumbnaiUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`
    }
  }
  return new Response('webhook received', { status: 200 });
};
