import Image from "next/image"

import { getStaticAssetUrl } from "@lib/util/static-asset"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@modules/common/components/ui"

const Hero = () => (
  <section className="bg-brand">
    <div className="content-container py-5 small:py-8">
      <div className="forge-frame relative min-h-[34rem] overflow-hidden bg-brand">
        <Image
          src={getStaticAssetUrl("/images/catalog-hero-placeholder.webp")}
          alt=""
          fill
          priority
          className="object-cover object-center opacity-45 grayscale-[25%] saturate-75"
          sizes="(max-width: 1440px) 100vw, 1440px"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(207,165,63,0.18),transparent_28%),linear-gradient(90deg,rgba(5,5,6,1)_12%,rgba(5,5,6,0.9)_50%,rgba(5,5,6,0.3)_100%)]" />
        <div className="relative z-10 flex min-h-[34rem] max-w-3xl flex-col justify-center px-7 py-16 text-brand-contrast small:px-16">
          <Image
            src={getStaticAssetUrl("/logo.png")}
            alt="Valhalla Forge"
            width={562}
            height={410}
            priority
            className="mb-3 h-auto w-44 object-contain drop-shadow-[0_0_24px_rgba(207,165,63,0.16)]"
          />
          <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.26em] text-brand-accent">
            Cards · Collectibles · Artifacts
          </p>
          <h1 className="display-heading text-[clamp(3.25rem,7vw,6.8rem)] leading-[0.86]">
            Forge your<br />
            <span className="gold-text">collection.</span>
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-7 text-brand-contrast/65 small:text-base">
            Curated pieces for players, collectors, and explorers of worlds that deserve to exist beyond the screen.
          </p>
          <div className="mt-9 flex flex-col gap-3 xsmall:flex-row">
            <LocalizedClientLink href="/store" className="w-full xsmall:w-auto">
              <Button size="large" className="w-full min-w-44 !rounded-sm !bg-brand-accent !font-bold !uppercase !tracking-[0.1em] !text-brand-accent-foreground hover:!bg-[#efd783]">
                Explore the forge <span aria-hidden="true">→</span>
              </Button>
            </LocalizedClientLink>
            <LocalizedClientLink href="/store?sortBy=created_at" className="w-full xsmall:w-auto">
              <Button size="large" variant="secondary" className="w-full !rounded-sm !border-brand-accent/45 !bg-black/20 !text-brand-contrast hover:!border-brand-accent hover:!bg-brand-accent/10">
                New arrivals
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </div>
    <div className="border-y border-brand-accent/15 bg-brand-header text-brand-contrast">
      <div className="content-container grid grid-cols-1 divide-y divide-brand-accent/10 py-1 text-center font-mono text-[10px] font-bold uppercase tracking-[0.16em] xsmall:grid-cols-3 xsmall:divide-x xsmall:divide-y-0">
        <p className="py-4">Protected checkout</p>
        <p className="py-4 text-brand-accent">Forge-worthy dispatch</p>
        <p className="py-4">Built for collectors</p>
      </div>
    </div>
  </section>
)

export default Hero
