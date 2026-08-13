import { Container, Heading, Text } from "@modules/common/components/ui"

import { isStripeLike, paymentInfoMap } from "@lib/constants"
import Divider from "@modules/common/components/divider"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]

  return (
    <div>
      <Heading level="h2" className="my-6 flex flex-row font-display text-2xl text-brand-foreground">
        Payment
      </Heading>
      <div>
        {payment && (
          <div className="flex w-full flex-col gap-6 small:flex-row">
            <div className="flex flex-col small:w-1/3">
              <Text className="mb-1 font-semibold text-brand-foreground">
                Payment method
              </Text>
              <Text
                className="text-sm text-brand-muted"
                data-testid="payment-method"
              >
                {paymentInfoMap[payment.provider_id].title}
              </Text>
            </div>
            <div className="flex flex-col small:w-2/3">
              <Text className="mb-1 font-semibold text-brand-foreground">
                Payment details
              </Text>
              <div className="flex items-center gap-2 text-sm text-brand-muted">
                <Container className="flex h-7 w-fit items-center p-2 text-brand-accent">
                  {paymentInfoMap[payment.provider_id].icon}
                </Container>
                <Text data-testid="payment-amount">
                  {isStripeLike(payment.provider_id) && payment.data?.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })} paid at ${new Date(
                        payment.created_at ?? ""
                      ).toLocaleString()}`}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>

      <Divider className="mt-8" />
    </div>
  )
}

export default PaymentDetails
