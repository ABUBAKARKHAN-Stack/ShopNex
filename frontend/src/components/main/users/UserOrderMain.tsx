import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Layout, SecondaryHeader, SideBar } from "@/components/layout/shared";
import { BlurFade } from "@/components/magicui/blur-fade";
import { DashboardMainHeader } from "@/components/reusable/shared";
import {
  Ban,
  FileDown,
  LoaderPinwheel,
  Package,
  PackageSearch,
  ShoppingBag,
} from "lucide-react";
import { useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import { OrderDetails } from "@/components/sections/user/dashboard/orders";
import { Button } from "@/components/ui/button";
import { isOrderCancelable } from "@/utils/IsOrderCancelable";
import { OrderLoadingStates, OrderStatus } from "@/types/main.types";
import { useOrderContext } from "@/context/order.context";
import { DeliveryInfo } from "@/components/reusable/user";
import { ButtonLoader } from "@/components/Skeleton&Loaders/loaders";

const UserOrderMain = () => {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const sideBarRef = useRef<HTMLElement>(null);
  const {
    products,
    orderId,
    totalAmount,
    confirmedAt,
    orderStatus,
    shippingAddress,
    shippingMethod,
    shipping,
    paymentStatus,
    refund,
    paymentMethod,
    deliveryDate,
    isDelivered,
    orderPlaceAt,
  } = useLoaderData();

  const isCancelable = isOrderCancelable(orderStatus, confirmedAt);
  const {
    cancelOrder,
    orderLoading,
    downloadOrderInvoice
  } = useOrderContext();
  const { revalidate } = useRevalidator();
  const navigate = useNavigate();
  const downloadOrderInvoiceLoading =
    orderLoading === OrderLoadingStates.DOWNLOAD_INVOICE;
  const orderCancelLoading = orderLoading === OrderLoadingStates.CANCEL_ORDER;

  const handleOrderCanel = () => {
    cancelOrder(orderId);
    revalidate();
  };

  const handleTrackOrder = () => {
    navigate(`/track-order?orderId=${orderId}`);
  };

  const handleDownloadInvoice = () => {
    downloadOrderInvoice(orderId, products);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: [0.165, 0.84, 0.44, 1], duration: 1.5 }}
      >
        <SecondaryHeader setIsOpen={setIsOpen} ref={headerRef} />
      </motion.div>
      <div className="my-5 flex">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ease: [0.165, 0.84, 0.44, 1], duration: 1.5 }}
        >
          <SideBar
            ref={sideBarRef}
            isDrawerOpen={isOpen}
            setIsDrawerOpen={setIsOpen}
          />
        </motion.div>
        <Layout>
          <div className="space-y-10 px-4">
            <BlurFade delay={1} duration={0.5} blur="50px" direction="down">
              <DashboardMainHeader
                mainIcon={<Package className="size-8 stroke-3" />}
                mainHeading="Order Details"
                subIcon={
                  <ShoppingBag className="size-5 text-cyan-100 dark:text-orange-100" />
                }
                subText="Review your order status, payment details, and itemized breakdown here."
                animateClassName="order-details-header"
              />
            </BlurFade>

            <BlurFade
              delay={1.5}
              duration={0.5}
              direction="right"
              className="space-y-3"
            >
              <OrderDetails
                confirmedAt={confirmedAt}
                isDelivered={isDelivered}
                orderId={orderId}
                orderPlaceAt={orderPlaceAt}
                orderStatus={orderStatus}
                paymentMethod={paymentMethod}
                paymentStatus={paymentStatus}
                products={products}
                refund={refund}
                shipping={shipping}
                shippingAddress={shippingAddress}
                shippingMethod={shippingMethod}
                totalAmount={totalAmount}
              />
              {confirmedAt && (
                <DeliveryInfo
                  confirmedAt={confirmedAt}
                  deliveryDate={deliveryDate}
                  className="rounded-md"
                />
              )}
            </BlurFade>

            {/* Action Buttons */}
            <BlurFade
              inView
              duration={0.5}
              inViewMargin="-70px"
              direction="down"
              className="grid grid-cols-1 gap-4 md:grid-cols-3"
            >
              <Button
                onClick={handleTrackOrder}
                disabled={
                  orderStatus === OrderStatus.PENDING ||
                  orderStatus === OrderStatus.CANCELLED
                }
                size="lg"
                variant="default"
              >
                <PackageSearch className="size-4.5" />
                Track Order
              </Button>
              <Button
                onClick={handleDownloadInvoice}
                disabled={
                  orderStatus === OrderStatus.PENDING ||
                  downloadOrderInvoiceLoading
                }
                size="lg"
                variant="outline"
              >
                {downloadOrderInvoiceLoading ? (
                  <ButtonLoader
                    loaderText="Downloaing Invoice..."
                  />
                ) : (
                  <>
                    <FileDown className="size-4.5" />
                    Download Invoice
                  </>
                )}
              </Button>
              <Button
                disabled={isDelivered || !isCancelable || orderCancelLoading}
                size="lg"
                variant="destructive"
                onClick={handleOrderCanel}
              >
                {orderCancelLoading ? (
                  <ButtonLoader
                    loaderText="Cancelling Order..."
                  />
                ) : (
                  <>
                    <Ban className="size-4.5" />
                    Cancel Order
                  </>
                )}
              </Button>
            </BlurFade>
          </div>
        </Layout>
      </div>
    </>
  );
};

export default UserOrderMain;
