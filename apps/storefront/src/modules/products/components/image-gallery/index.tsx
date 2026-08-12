"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import Image from "next/image"
import { useEffect, useState } from "react"

const ImageGallery = ({ images }: { images: HttpTypes.StoreProductImage[] }) => {
  const [selectedId, setSelectedId] = useState(images[0]?.id)
  const selectedImage = images.find((image) => image.id === selectedId) ?? images[0]

  useEffect(() => {
    setSelectedId(images[0]?.id)
  }, [images])

  if (!selectedImage?.url) {
    return <div className="aspect-[4/5] rounded-[var(--radius-card)] border border-brand-border bg-brand-image" />
  }

  return (
    <div className="grid gap-3 xsmall:grid-cols-[4.5rem_minmax(0,1fr)] small:gap-5">
      <div className="order-2 flex gap-3 overflow-x-auto xsmall:order-1 xsmall:flex-col">
        {images.map((image, index) => (
          <button
            type="button"
            key={image.id}
            onClick={() => setSelectedId(image.id)}
            aria-label={`View product image ${index + 1}`}
            aria-pressed={image.id === selectedImage.id}
            className={clx(
              "relative aspect-square w-[4.5rem] shrink-0 overflow-hidden rounded-[var(--radius-sm)] border bg-brand-image transition",
              image.id === selectedImage.id ? "border-brand" : "border-brand-border hover:border-brand-input"
            )}
          >
            {!!image.url && <Image src={image.url} alt="" fill className="object-contain p-2" sizes="72px" />}
          </button>
        ))}
      </div>
      <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] border border-brand-border bg-brand-image xsmall:order-2">
        <Image
          key={selectedImage.id}
          src={selectedImage.url}
          priority
          className="object-contain p-6 small:p-10"
          alt="Selected product image"
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
      </div>
    </div>
  )
}

export default ImageGallery
