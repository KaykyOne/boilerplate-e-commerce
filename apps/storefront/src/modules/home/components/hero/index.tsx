import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@modules/common/components/ui"

const Hero = () => (
  <section className="overflow-hidden border-b border-brand-border bg-brand-background">
    <div className="content-container grid min-h-[36rem] items-center gap-12 py-16 small:grid-cols-[1.05fr_.95fr] small:py-24">
      <div className="relative z-10 max-w-2xl">
        <p className="eyebrow mb-6">The considered collection</p>
        <h1 className="display-heading text-[clamp(3rem,7vw,6.5rem)] leading-[0.92]">Good things,<br /><em className="font-normal text-brand-accent">made easy.</em></h1>
        <p className="mt-7 max-w-lg text-base leading-7 text-brand-muted small:text-lg">A clean, adaptable shopping experience built around the products—not the noise.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <LocalizedClientLink href="/store"><Button size="large" className="min-w-40">Shop the collection <span aria-hidden="true">→</span></Button></LocalizedClientLink>
          <LocalizedClientLink href="/store?sortBy=created_at"><Button size="large" variant="secondary">New arrivals</Button></LocalizedClientLink>
        </div>
      </div>
      <div className="relative mx-auto h-[24rem] w-full max-w-xl small:h-[32rem]" aria-hidden="true">
        <div className="absolute inset-x-[8%] top-[6%] h-[82%] rotate-3 rounded-[2rem] bg-brand shadow-2xl" />
        <div className="absolute inset-x-[19%] top-0 h-[82%] -rotate-6 rounded-[2rem] border border-brand-border bg-[#e9d8c4] shadow-xl" />
        <div className="absolute inset-x-[28%] top-[14%] grid h-[72%] place-items-center rounded-[2rem] border border-white/70 bg-brand-surface shadow-2xl">
          <div className="text-center"><span className="mx-auto mb-5 block h-20 w-20 rounded-full border border-brand-border bg-brand-background" /><p className="eyebrow">Your product</p><p className="display-heading mt-2 text-3xl">Front and center</p></div>
        </div>
        <span className="absolute bottom-2 left-4 h-20 w-20 rounded-full bg-brand-accent" />
      </div>
    </div>
    <div className="border-t border-brand-border bg-brand-surface">
      <div className="content-container grid grid-cols-1 divide-y divide-brand-border py-1 text-center text-xs font-semibold uppercase tracking-[0.13em] xsmall:grid-cols-3 xsmall:divide-x xsmall:divide-y-0">
        <p className="py-4">Secure checkout</p><p className="py-4">Responsive support</p><p className="py-4">Simple returns</p>
      </div>
    </div>
  </section>
)

export default Hero
