import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import FeaturedCatalog from "@modules/home/components/featured-catalog"
import CategoryShowcase from "@modules/home/components/category-showcase"
import AboutStore from "@modules/home/components/about-store"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Storefront",
  description: "Discover a thoughtfully selected range of products.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const [{ collections }, categories, productResult] = await Promise.all([
    listCollections({ fields: "id, handle, title" }),
    listCategories(),
    listProducts({ regionId: region.id, queryParams: { limit: 8 } }),
  ])

  if (!collections) {
    return null
  }

  return (
    <>
      <Hero />
      <FeaturedCatalog products={productResult.response.products} region={region} />
      <CategoryShowcase categories={categories.filter((category) => !category.parent_category)} />
      <AboutStore />
      <div className="py-8 small:py-14">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div>
    </>
  )
}
