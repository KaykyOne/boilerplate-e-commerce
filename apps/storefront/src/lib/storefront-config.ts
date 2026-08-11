export const storefrontConfig = {
  name: "Storefront",
  shortName: "SF",
  tagline: "Everyday goods, thoughtfully selected.",
  announcement: "Free shipping on qualifying orders",
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
