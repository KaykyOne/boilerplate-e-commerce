const assetBaseUrl = (
  process.env.NEXT_PUBLIC_ASSET_BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  ""
).replace(/\/+$/, "")

export const getStaticAssetUrl = (assetPath: string) => {
  if (!assetPath.startsWith("/")) {
    return assetPath
  }

  return assetBaseUrl ? `${assetBaseUrl}${assetPath}` : assetPath
}
