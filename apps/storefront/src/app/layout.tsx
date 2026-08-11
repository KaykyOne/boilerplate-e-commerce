import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Storefront",
    template: "%s | Storefront",
  },
  description: "A modern storefront for thoughtfully selected products.",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <main className="relative min-h-screen">{props.children}</main>
      </body>
    </html>
  )
}
