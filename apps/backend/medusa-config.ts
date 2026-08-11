import { defineConfig, loadEnv, MedusaError } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const adminPath = process.env.ADMIN_PATH || "/app"

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
    redisUrl: process.env.REDIS_URL,
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
    backendUrl: process.env.MEDUSA_BACKEND_URL,
    storefrontUrl: process.env.MEDUSA_STOREFRONT_URL,
  },
})
