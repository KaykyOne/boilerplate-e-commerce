import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

const ImageGallery = ({ images }: { images: HttpTypes.StoreProductImage[] }) => (
  <div className="grid grid-cols-1 gap-4 xsmall:grid-cols-2">
    {images.map((image, index) => (
      <div key={image.id} className={`relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-[#f1f0eb] ${index === 0 ? "xsmall:col-span-2" : ""}`}>
        {!!image.url && <Image src={image.url} priority={index === 0} className="object-cover object-center" alt={`Product image ${index + 1}`} fill sizes={index === 0 ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 1024px) 50vw, 30vw"} />}
      </div>
    ))}
  </div>
)

export default ImageGallery
