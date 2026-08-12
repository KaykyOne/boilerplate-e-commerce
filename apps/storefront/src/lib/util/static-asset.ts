const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

export const getStaticAssetUrl = (assetPath: string) => {
  if (!assetPath.startsWith("/")) {
    return assetPath
  }

  return `${basePath}${assetPath}`
}
