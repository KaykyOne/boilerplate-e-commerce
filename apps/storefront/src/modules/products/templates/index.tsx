import React, { Suspense } from "react"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = { product: HttpTypes.StoreProduct; region: HttpTypes.StoreRegion; countryCode: string; images: HttpTypes.StoreProductImage[] }

const ProductTemplate: React.FC<ProductTemplateProps> = ({ product, region, countryCode, images }) => {
  if (!product?.id) return notFound()

  return (
    <>
      <div className="content-container py-7 small:py-11" data-testid="product-container">
        <nav className="mb-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-brand-muted"><LocalizedClientLink href="/">Home</LocalizedClientLink><span>›</span><LocalizedClientLink href="/store">Shop</LocalizedClientLink><span>›</span><span className="truncate">{product.title}</span></nav>
        <div className="grid items-start gap-10 small:grid-cols-[minmax(0,1.1fr)_minmax(20rem,.9fr)] medium:gap-16">
          <ImageGallery images={images} />
          <div className="small:sticky small:top-40">
            <ProductInfo product={product} />
            <div className="mt-8 border-t border-brand-border pt-7">
              <Suspense fallback={<ProductActions disabled product={product} region={region} />}><ProductActionsWrapper id={product.id} region={region} /></Suspense>
              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-brand-border pt-5 text-center text-[9px] font-semibold uppercase tracking-[0.1em] text-brand-muted"><span>Secure payment</span><span>Easy returns</span><span>Fast dispatch</span></div>
            </div>
          </div>
        </div>
        <div className="mt-14 border-t border-brand-border pt-10 small:mt-20 small:pt-14"><ProductTabs product={product} /></div>
      </div>
      <div className="content-container my-16 small:my-28" data-testid="related-products-container"><Suspense fallback={<SkeletonRelatedProducts />}><RelatedProducts product={product} countryCode={countryCode} /></Suspense></div>
    </>
  )
}

export default ProductTemplate
