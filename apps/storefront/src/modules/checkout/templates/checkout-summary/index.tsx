import { Heading } from "@modules/common/components/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  return (
    <div className="sticky top-8 flex flex-col-reverse gap-y-8 py-8 small:flex-col small:py-0">
      <div className="surface-card flex w-full flex-col p-5 small:p-6">
        <Divider className="my-6 small:hidden" />
        <Heading
          level="h2"
          className="display-heading flex flex-row items-baseline text-3xl font-normal"
        >
          Order summary
        </Heading>
        <Divider className="my-6" />
        <CartTotals totals={cart} />
        <ItemsPreviewTemplate cart={cart} />
        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
