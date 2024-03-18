import {
  IngressAudioEncodingPreset,
  IngressInput,
  IngressClient,
  IngressVideoEncodingPreset,
  TrackSource,
  RoomServiceClient,
  IngressVideoOptions,
  IngressAudioOptions,
  type CreateIngressOptions,
} from "livekit-server-sdk";

import { Resolvers, Toast, ToastTypes } from "@/gql/types";

import { IngressCreatedFailed, NotAuthorized } from "@/lib/errors";
import {
  INGRESS_CREATED,
  INGRESS_CREATED_FAILED,
  INGRESS_RESET_DONE,
  NOT_AUTHORIZED,
} from "@/constants/message.constants";

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

const ingressClient = new IngressClient(process.env.LIVEKIT_API_URL!);

export const IngressResolvers: Resolvers = {
  Mutation: {
    createIngress: async (_, { input }, { db, user }) => {
      if (!user) {
        throw NotAuthorized(NOT_AUTHORIZED);
      }

      await resetIngress(user.id);

      const { ingressType } = input || {};

      const options: CreateIngressOptions = {
        name: user.slugName! || user.id,
        roomName: user.id,
        participantIdentity: user.id,
        participantName: user.slugName! || user.id,
      };

      if (ingressType === IngressInput.WHIP_INPUT) {
        options.bypassTranscoding = true;
      } else if (ingressType === IngressInput.URL_INPUT) {
        options.video = new IngressVideoOptions({
          source: TrackSource.CAMERA,
          encodingOptions: {
            case: "preset",
            value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
          },
        });
        options.audio = new IngressAudioOptions({
          source: TrackSource.MICROPHONE,
          encodingOptions: {
            case: "preset",
            value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
          },
        });
      }

      const ingress = await ingressClient.createIngress(ingressType, options);

      if (!ingress || !ingress.url || !ingress.streamKey) {
        throw IngressCreatedFailed(INGRESS_CREATED_FAILED);
      }

      const stream = await db.stream.update({
        where: { userId: user.id },
        data: {
          ingressId: ingress.ingressId,
          serverUrl: ingress.url,
          streamKey: ingress.streamKey,
        },
      });

      const toast: Toast = {
        text: `${INGRESS_CREATED} `,
        type: ToastTypes.Success,
      };

      return { stream, toast };
    },
    resetIngress: async (_, { input }, { db, user }) => {
      if (!user) {
        throw NotAuthorized(NOT_AUTHORIZED);
      }

      const { hostIdentity = "" } = input || {};

      await resetIngress(hostIdentity);

      const stream = await db.stream.update({
        where: { userId: user.id },
        data: {
          ingressId: null,
          serverUrl: null,
          streamKey: null,
        },
      });

      const toast: Toast = {
        text: `${INGRESS_RESET_DONE} `,
        type: ToastTypes.Success,
      };

      return { stream, toast };
    },
  },
};

const resetIngress = async (hostIdentity: string) => {
  const ingresses = await ingressClient.listIngress({
    roomName: hostIdentity,
  });

  const rooms = await roomService.listRooms([hostIdentity]);

  for (const room of rooms) {
    await roomService.deleteRoom(room.name);
  }

  for (const ingress of ingresses) {
    if (ingress.ingressId) {
      await ingressClient.deleteIngress(ingress.ingressId);
    }
  }
};
