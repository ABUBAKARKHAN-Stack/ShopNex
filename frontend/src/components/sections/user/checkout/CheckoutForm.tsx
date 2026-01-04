import { Button } from "@/components/ui/button";
import { IShippingAddress, PaymentMethod, QueryKeys } from "@/types/main.types";
import { CreditCard, LoaderPinwheel } from "lucide-react";
import { FC, FormEvent, useEffect, useRef, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useProductContext } from "@/context/product.context";
import { errorToast, successToast } from "@/utils/toastNotifications";
import { useNavigate } from "react-router-dom";
import { ApiError } from "@/utils/ApiError";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { shippingAddressSchema } from "@/schemas/checkoutSchema";
import { useTheme } from "next-themes";
import { useCartContext } from "@/context/cart.context";
import { queryClient } from "@/utils/tanstackQueryClient";
import { useOrderContext } from "@/context/order.context";
import { ButtonLoader } from "@/components/Skeleton&Loaders/loaders";

type Props = {
  totalAmount: number;
  shippingAddressCompleted: boolean;
  shippingAddress: z.infer<typeof shippingAddressSchema>;
  activeTab: string;
  shippingMethod: string;
};

const CheckoutForm: FC<Props> = ({
  totalAmount,
  shippingAddressCompleted,
  shippingAddress,
  activeTab,
  shippingMethod,
}) => {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { resolvedTheme } = useTheme();
  const {
    completeCheckout,
  } = useOrderContext();
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const handleSubmitViaCard = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) {
      errorToast("Stripe is not ready yet. Please wait...");
      return;
    }

    if (!shippingAddressCompleted) {
      errorToast("Please complete shipping details first.");
      return;
    }
    const card = elements.getElement(CardElement);
    setPaymentLoading(true);
    try {
      const checkoutResponse = await completeCheckout({
        paymentMethod,
        shippingAddress: shippingAddress as IShippingAddress,
        totalAmountInUSD: totalAmount,
        shippingMethod,
      });

      if (!checkoutResponse) return;
      const {
        clientSecret,
        orderId
      } = checkoutResponse


      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: card!,
          },
        },
      );
      if (error) {
        errorToast(error.message || "Something went wrong");
      } else if (paymentIntent.status === "succeeded") {
        successToast("Payment Successful!");
        queryClient.setQueryData([QueryKeys.GET_CART], () => ({ totalAmount: 0, products: [] }));
        timeoutRef.current = setTimeout(() => {
          navigate(`/checkout/success?orderId=${orderId}`);
        }, 1000);
      }
    } catch (error) {
      const err = error as Error;
      throw new ApiError(500, err.message);
    } finally {
      setPaymentLoading(false);

    }
  };

  const handleCod = async () => {
    setPaymentLoading(true)
    try {
      const checkoutResponse = await completeCheckout({
        paymentMethod,
        shippingAddress: shippingAddress as IShippingAddress,
        totalAmountInUSD: totalAmount,
        shippingMethod,
      });
      if (!checkoutResponse) return;
      successToast("Order Placed Successfully");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_CART] })
      timeoutRef.current = setTimeout(() => {
        navigate(`/checkout/success?orderId=${checkoutResponse.orderId}`);
      }, 100);
    } catch (error) {
      console.log("COD ERROR :: ", error);
    } finally {
      setPaymentLoading(false)
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: resolvedTheme === "dark" ? "#ffffff" : "#1a1a1a",
        fontSize: "16px",
        "::placeholder": {
          color: resolvedTheme === "dark" ? "#a0a0a0" : "#999999",
        },
      },
      invalid: {
        color: "red",
      },
    },
    hidePostalCode: true,
  };

  return activeTab === "payment" ? (
    <div className="w-full">
      <div className="bg-background overflow-hidden rounded-2xl">
        {/* Header */}
        <div className="rounded-t-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 p-6 dark:from-orange-500 dark:to-orange-600">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-white">
            <CreditCard className="h-6 w-6" />
            Select Payment Method
          </h2>
          <p className="mt-2 text-cyan-50 dark:text-orange-100">
            Choose your preferred payment option to complete the order
          </p>
        </div>

        {/* Payment Method Radio Buttons */}
        <RadioGroup
          onValueChange={(value) => setPaymentMethod(value)}
          className="space-y-4 p-6"
          defaultValue={paymentMethod}
        >
          <div className="flex items-center gap-x-3">
            <RadioGroupItem
              id="cod"
              value={PaymentMethod.COD}
              className="size-5"
            />
            <Label htmlFor="cod" className="text-base">
              Cash On Delivery (COD)
            </Label>
          </div>

          <div className="flex items-center gap-x-3">
            <RadioGroupItem
              id="stripe"
              value={PaymentMethod.STRIPE}
              className="size-5"
            />
            <Label htmlFor="stripe" className="text-base">
              Card Payment (Stripe)
            </Label>
          </div>
        </RadioGroup>

        <Separator />

        {/* Stripe Payment Info */}
        {paymentMethod === PaymentMethod.STRIPE ? (
          <div className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-950 dark:text-gray-300">
              <CreditCard className="size-6" />
              Payment Information
            </h3>

            <form onSubmit={handleSubmitViaCard} className="space-y-6">
              <div className="bg-background rounded-md border border-[#3C3C43] px-4 py-3">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>

              <Button
                size="lg"
                type="submit"
                disabled={paymentLoading || !stripe}
                className="flex w-full items-center justify-center gap-2"
              >
                {paymentLoading ? (
                  <>
                    <ButtonLoader
                      loaderText="Processing Payment..."
                    />
                  </>
                ) : (
                  "Complete Order"
                )}
              </Button>
            </form>
          </div>
        ) : paymentMethod === PaymentMethod.COD ? (
          <div className="p-6">
            <Button
              onClick={handleCod}
              size={"lg"}
              disabled={paymentLoading}
            >
              {
                paymentLoading ? <ButtonLoader
                  loaderText="Processing Order..."
                /> : "Complete Order Via Payment Method COD"
              }
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
};

export default CheckoutForm;
