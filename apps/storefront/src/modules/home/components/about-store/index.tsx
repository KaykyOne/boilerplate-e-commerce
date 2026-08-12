import Image from "next/image"

import { getStaticAssetUrl } from "@lib/util/static-asset"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const storeValues = [
  { number: "ᚠ", title: "Curated selection", text: "Items chosen for those who know and inhabit every realm." },
  { number: "ᚢ", title: "Clear inventory", text: "Availability stays visible as you explore the catalog." },
  { number: "ᚦ", title: "Secure purchase", text: "A direct path from the chosen artifact to your order." },
  { number: "ᚨ", title: "Human support", text: "Service designed for players and collectors." },
]

const AboutStore = () => (
  <section className="bg-brand text-brand-contrast">
    <div className="content-container grid min-h-[34rem] p-0 small:grid-cols-2 small:px-10 medium:px-10">
      <div className="forge-frame relative min-h-80 overflow-hidden small:min-h-full">
        <Image src={getStaticAssetUrl("/images/catalog-hero-placeholder.webp")} alt="Cards and collectible items" fill className="object-cover object-right opacity-60 grayscale-[20%]" sizes="(max-width: 1024px) 100vw, 50vw" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(207,165,63,0.16),transparent_38%),linear-gradient(to_top,rgba(5,5,6,0.8),transparent)]" />
      </div>

      <div className="flex flex-col justify-center px-6 py-12 small:px-12 small:py-16">
        <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand-accent">The legend behind the store</p>
        <h2 className="display-heading text-4xl leading-[0.92] small:text-6xl">
          Where passions<br /><span className="gold-text">become relics.</span>
        </h2>
        <p className="mt-6 max-w-xl text-sm leading-7 text-brand-contrast/65 small:text-base">
          Valhalla Forge was built for those who see beyond the product: every card, miniature, and piece carries a story ready to join your collection.
        </p>
        <p className="mt-4 max-w-xl text-sm leading-7 text-brand-contrast/65">
          Organized categories, visible inventory, and clear pricing keep the experience focused from the first click to checkout.
        </p>
        <LocalizedClientLink href="/store" className="mt-8 inline-flex h-12 w-fit items-center justify-center border border-brand-accent bg-brand-accent px-6 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand-accent-foreground transition hover:bg-[#efd783]">
          Enter the forge →
        </LocalizedClientLink>
      </div>
    </div>

    <div className="border-t border-brand-accent/15 bg-brand-header">
      <div className="content-container grid divide-y divide-brand-accent/10 xsmall:grid-cols-2 xsmall:divide-x xsmall:divide-y-0 medium:grid-cols-4">
        {storeValues.map((item) => (
          <div key={item.number} className="p-6 small:p-8">
            <span className="font-display text-xl text-brand-accent">{item.number}</span>
            <h3 className="mt-4 text-xs font-bold uppercase tracking-[0.1em]">{item.title}</h3>
            <p className="mt-2 text-xs leading-5 text-brand-contrast/50">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default AboutStore
