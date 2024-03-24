import { NextRequest, NextResponse } from "next/server";
import { ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { s3 } from "@/lib/s3";
import {
  IMAGE_PROFILE_UPLOAD_BUCKET,
  PROFILE_IMAGE_PREFIX,
} from "@/constants/common.constants";
import { SOMETHING_WENT_WRONG } from "@/constants/message.constants";

const Bucket = IMAGE_PROFILE_UPLOAD_BUCKET;

// endpoint to get the list of files in the bucket
export async function GET() {
  try {
    const response = await s3.send(new ListObjectsCommand({ Bucket }));
    return NextResponse.json(response?.Contents ?? []);
  } catch (error) {
    console.error(error);
    return NextResponse.json([]);
  }
}

// endpoint to upload a file to the bucket
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    const uploadStatus = await Promise.all(
      files.map(async (file) => {
        // not sure why I have to override the types here
        const Body = (await file.arrayBuffer()) as Buffer;
        const Key = `${PROFILE_IMAGE_PREFIX}${file.name}`;
        const command = new PutObjectCommand({
          Bucket,
          Key,
          Body,
        });
        const s3Response = await s3.send(command);
        return { ...s3Response, Key };
      })
    );

    return NextResponse.json(uploadStatus);
  } catch (error) {
    console.error(error);
    return NextResponse.json(SOMETHING_WENT_WRONG);
  }
}
