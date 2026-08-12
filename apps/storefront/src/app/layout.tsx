import { getBaseURL } from "@lib/util/env"
import { getStaticAssetUrl } from "@lib/util/static-asset"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Valhalla Forge",
    template: "%s | Valhalla Forge",
  },
  description: "Cards, collectibles, and artifacts curated for those who take the hobby seriously.",
  icons: {
    icon: getStaticAssetUrl("/logo.png"),
  },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="dark">
      <body>
        <main className="relative min-h-screen">{props.children}</main>
      </body>
    </html>
  )
}
