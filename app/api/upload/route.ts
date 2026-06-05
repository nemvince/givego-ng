import { type Router, route } from "@better-upload/server";
import { toRouteHandler } from "@better-upload/server/adapters/next";
import { tigris } from "@better-upload/server/clients";
import { env } from "@/lib/env";

const router: Router = {
  client: tigris({
    accessKeyId: env.BETTER_UPLOAD_KEY_ID,
    secretAccessKey: env.BETTER_UPLOAD_SECRET,
    endpoint: env.BETTER_UPLOAD_HOST,
  }),
  bucketName: env.BETTER_UPLOAD_BUCKET_NAME,
  routes: {
    images: route({
      fileTypes: ["image/*"],
      multipleFiles: true,
      maxFiles: 5,
    }),
  },
};

export const { POST } = toRouteHandler(router);
