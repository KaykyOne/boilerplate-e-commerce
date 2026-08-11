import { listCategories } from "@lib/data/categories"
import { storefrontConfig } from "@lib/storefront-config"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li><LocalizedClientLink href={href} className="text-sm text-white/60 transition-colors hover:text-white">{children}</LocalizedClientLink></li>
)

export default async function Footer() {
  const categories = await listCategories().catch(() => [])
  const rootCategories = categories.filter((category) => !category.parent_category).slice(0, 6)

  return (
    <footer className="mt-20 border-t border-brand-border bg-brand">
      <div className="content-container py-14 text-brand-contrast small:py-20">
        <div className="grid gap-12 border-b border-white/15 pb-14 small:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <LocalizedClientLink href="/" className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-white/30 font-display">{storefrontConfig.shortName}</span>
              <span className="text-sm font-bold uppercase tracking-[0.18em]">{storefrontConfig.name}</span>
            </LocalizedClientLink>
            <p className="display-heading text-3xl leading-tight text-white/90">{storefrontConfig.tagline}</p>
            <p className="mt-5 text-sm leading-6 text-white/60">A flexible commerce foundation designed to grow with your catalog and your brand.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 xsmall:grid-cols-3">
            <div><p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Shop</p><ul className="space-y-3">{rootCategories.map((category) => <FooterLink key={category.id} href={`/categories/${category.handle}`}>{category.name}</FooterLink>)}<FooterLink href="/store">All products</FooterLink></ul></div>
            <div><p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Support</p><ul className="space-y-3">{storefrontConfig.footer.support.map((item) => <FooterLink key={item.label} href={item.href}>{item.label}</FooterLink>)}</ul></div>
            <div><p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Legal</p><ul className="space-y-3">{storefrontConfig.footer.policies.map((item) => <FooterLink key={item.label} href={item.href}>{item.label}</FooterLink>)}</ul></div>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-7 text-xs text-white/50 xsmall:flex-row xsmall:items-center xsmall:justify-between">
          <p>© {new Date().getFullYear()} {storefrontConfig.name}. All rights reserved.</p>
          <p>Secure payments · Thoughtful service · Easy returns</p>
        </div>
      </div>
    </footer>
  )
}
