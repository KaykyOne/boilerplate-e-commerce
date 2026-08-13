import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div>
      <Heading level="h2" className="my-6 flex flex-row font-display text-2xl text-brand-foreground">
        Delivery
      </Heading>
      <div className="flex flex-col gap-6 small:flex-row small:gap-x-8">
        <div
          className="flex flex-col small:w-1/3"
          data-testid="shipping-address-summary"
        >
          <Text className="mb-1 font-semibold text-brand-foreground">
            Shipping Address
          </Text>
          <Text className="text-sm text-brand-muted">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </Text>
          <Text className="text-sm text-brand-muted">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </Text>
          <Text className="text-sm text-brand-muted">
            {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city}
          </Text>
          <Text className="text-sm text-brand-muted">
            {order.shipping_address?.country_code?.toUpperCase()}
          </Text>
        </div>

        <div
          className="flex flex-col small:w-1/3"
          data-testid="shipping-contact-summary"
        >
          <Text className="mb-1 font-semibold text-brand-foreground">Contact</Text>
          <Text className="text-sm text-brand-muted">
            {order.shipping_address?.phone}
          </Text>
          <Text className="text-sm text-brand-muted">{order.email}</Text>
        </div>

        <div
          className="flex flex-col small:w-1/3"
          data-testid="shipping-method-summary"
        >
          <Text className="mb-1 font-semibold text-brand-foreground">Method</Text>
          <Text className="text-sm text-brand-muted">
            {(order.shipping_methods?.[0] as { name?: string })?.name} (
            {convertToLocale({
              amount: order.shipping_methods?.[0].total ?? 0,
              currency_code: order.currency_code,
            })}
            )
          </Text>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default ShippingDetails
