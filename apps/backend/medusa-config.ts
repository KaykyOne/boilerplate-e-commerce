import {
  defineConfig,
  loadEnv,
  MedusaError,
} from "@medusajs/framework/utils"
import { resolve } from "path"

const nodeEnv = process.env.NODE_ENV || "development"

loadEnv(nodeEnv, process.cwd())

const adminPath = process.env.ADMIN_PATH || "/app"
const backendUrl =
  nodeEnv === "development"
    ? process.env.MEDUSA_DEV_BACKEND_URL || "http://localhost:9000"
    : process.env.MEDUSA_BACKEND_URL
const redisUrl =
  nodeEnv === "development"
    ? process.env.MEDUSA_DEV_REDIS_URL
    : process.env.REDIS_URL
const fileUploadDir =
  nodeEnv === "development"
    ? process.env.MEDUSA_DEV_FILE_UPLOAD_DIR ||
    resolve(process.cwd(), "static")
    : process.env.FILE_UPLOAD_DIR || "/server/static"
const fileBackendUrl =
  nodeEnv === "development"
    ? process.env.MEDUSA_DEV_FILE_BACKEND_URL || `${backendUrl}/static`
    : process.env.FILE_BACKEND_URL || `${backendUrl}/static`

if (!adminPath.startsWith("/") || adminPath.endsWith("/")) {
  throw new MedusaError(
    MedusaError.Types.INVALID_DATA,
    "ADMIN_PATH must start with / and must not end with /"
  )
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: {
      connection: {
        ssl: false,
      },
    },
    redisUrl,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  admin: {
    path: adminPath as `/${string}`,
    backendUrl,
    storefrontUrl: process.env.MEDUSA_STOREFRONT_URL,
  },
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-local",
            id: "local",
            options: {
              upload_dir: fileUploadDir,
              backend_url: fileBackendUrl,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
              capture: true,
            },
          },
        ],
      },
    }
  ],
})
