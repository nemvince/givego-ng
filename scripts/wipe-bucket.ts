import {
  DeleteObjectsCommand,
  type DeleteObjectsRequest,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import { env } from "@/lib/env";

const client = new S3Client({
  region: env.BETTER_UPLOAD_REGION,
  endpoint: env.BETTER_UPLOAD_HOST,
  credentials: {
    accessKeyId: env.BETTER_UPLOAD_KEY_ID,
    secretAccessKey: env.BETTER_UPLOAD_SECRET,
  },
  forcePathStyle: true,
});

async function main() {
  // wipe all objects in the bucket
  console.log(
    `Wiping all objects in bucket "${env.BETTER_UPLOAD_BUCKET_NAME}"...`
  );
  let ContinuationToken: string | undefined;
  do {
    const listResponse = await client.send(
      new ListObjectsV2Command({
        Bucket: env.BETTER_UPLOAD_BUCKET_NAME,
        ContinuationToken,
      })
    );

    if (listResponse.Contents && listResponse.Contents.length > 0) {
      const deleteParams: DeleteObjectsRequest = {
        Bucket: env.BETTER_UPLOAD_BUCKET_NAME,
        Delete: {
          Objects: listResponse.Contents.map((obj) => ({ Key: obj.Key })),
          Quiet: true,
        },
      };
      await client.send(new DeleteObjectsCommand(deleteParams));
      console.log(`Deleted ${deleteParams.Delete?.Objects?.length} objects...`);
    }

    ContinuationToken = listResponse.IsTruncated
      ? listResponse.NextContinuationToken
      : undefined;
  } while (ContinuationToken);

  console.log("Bucket wipe complete.");
}

main().catch((err) => {
  console.error("Failed to wipe bucket:", err);
  process.exit(1);
});
