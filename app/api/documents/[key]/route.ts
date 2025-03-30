import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { s3 } from "@/lib/s3";
import { logger } from "@/lib/logger";
import {
  IMAGE_PROFILE_UPLOAD_BUCKET,
  PROFILE_IMAGE_PREFIX,
} from "@/constants/common.constants";
import { SOMETHING_WENT_WRONG } from "@/constants/message.constants";

const Bucket = IMAGE_PROFILE_UPLOAD_BUCKET;

interface GetProps {
  params: Promise<{
    key: string;
  }>;
}

export async function GET(_: Request, props: GetProps) {
  const params = await props.params;
  try {
    const command = new GetObjectCommand({
      Bucket,
      Key: `${PROFILE_IMAGE_PREFIX}${params.key}`,
    });

    const src = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return NextResponse.json({ src });
  } catch (error) {
    logger.error(error);
    console.error(error);
    return NextResponse.json(SOMETHING_WENT_WRONG);
  }
}
