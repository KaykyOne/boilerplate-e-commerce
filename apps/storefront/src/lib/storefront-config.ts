export const storefrontConfig = {
  name: "Valhalla Forge",
  shortName: "VF",
  tagline: "Relics for those who forge passion into a collection.",
  announcement: "The forge is open · Curated goods for dedicated collectors",
  navigation: [
    { label: "Shop all", href: "/store" },
    { label: "New arrivals", href: "/store?sortBy=created_at" },
  ],
  footer: {
    support: [
      { label: "Contact", href: "/" },
      { label: "Shipping & returns", href: "/" },
      { label: "FAQ", href: "/" },
    ],
    policies: [
      { label: "Privacy", href: "/" },
      { label: "Terms", href: "/" },
      { label: "Accessibility", href: "/" },
    ],
  },
} as const
