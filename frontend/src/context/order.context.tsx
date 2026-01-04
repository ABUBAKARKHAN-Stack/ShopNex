import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getAllOrders as getAllOrdersApi,
} from "@/API/userApi";
import { AxiosError } from "axios";
import {
  ApiErrorType,
  CompleteCheckoutBody,
  CompleteCheckoutReturnBody,
  IOrder,
  OrderedProduct,
  OrderLoadingStates,
} from "@/types/main.types";
import { useOrderQuery } from "@/hooks/useOrderQuery";

type OrderContextType = {
  orderLoading: OrderLoadingStates;
  proceedToCheckout: (navigate: (path: string) => void) => void;
  completeCheckout: (checkoutBody: CompleteCheckoutBody) => Promise<CompleteCheckoutReturnBody | null>
  userTrackOrder: (orderId: string, navigate: (path: string) => void) => void;
  getAllOrders: (params?: any) => Promise<any>;
  ordersData: IOrder[];
  setOrdersData: Dispatch<SetStateAction<IOrder[]>>;
  pendingOrders: any[];
  cancelledOrders: any[];
  confirmedOrders: any[];
  cancelOrder: (orderId: string) => void;
  ordersCount: number;
  downloadOrderInvoice: (
    orderId: string,
    products: OrderedProduct[],
  ) => void;
};

const OrderContext = createContext<OrderContextType | null>(null);

const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orderLoading, setOrderLoading] = useState<OrderLoadingStates>(
    OrderLoadingStates.IDLE,
  );
  const [pendingOrders, setPendingOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [ordersData, setOrdersData] = useState<IOrder[]>([]);
  const [ordersCount, setOrdersCount] = useState(0);

  const {
    useProceedToCheckout,
    useCompleteCheckout,
    useUserTrackOrder,
    useCancelOrder,
    useDownLoadOrderInvoice
  } = useOrderQuery();
  const proceedToCheckoutMutation = useProceedToCheckout(setOrderLoading);
  const completeCheckoutMutation = useCompleteCheckout(setOrderLoading);
  const userTrackOrderMutation = useUserTrackOrder(setOrderLoading);
  const cancelOrderMutation = useCancelOrder(setOrderLoading);
  const downloadOrderInvoiceMutation = useDownLoadOrderInvoice(setOrderLoading);

  const proceedToCheckout = (navigate: (path: string) => void) => {
    proceedToCheckoutMutation.mutate(navigate);
  };

  const completeCheckout = async (checkoutBody: CompleteCheckoutBody) => {
    const res = await completeCheckoutMutation.mutateAsync(checkoutBody);
    return res
  };


  const userTrackOrder = (
    orderId: string,
    navigate: (path: string) => void,
  ) => {
    userTrackOrderMutation.mutate({
      navigate,
      orderId,
    });
  };

  const getAllOrders = async (params?: any) => {
    setOrderLoading(OrderLoadingStates.GET_ALL_ORDERS);
    try {
      const res = await getAllOrdersApi(params);

      if (res.status === 200) {
        const orders = res.data.data.orders;
        const ordersCount = res.data.data.orders.length;

        setOrdersCount(ordersCount);
        const confirmedOrders = orders.filter(
          (o: any) => o.status === "confirmed",
        );
        const pendingOrders = orders.filter((o: any) => o.status === "pending");
        const cancelledOrders = orders.filter(
          (o: any) => o.status === "cancelled",
        );
        setConfirmedOrders(confirmedOrders);
        setPendingOrders(pendingOrders);
        setCancelledOrders(cancelledOrders);
        return orders;
      }
    } catch (error) {
      const err = error as AxiosError<ApiErrorType>;
      console.log(err);
    } finally {
      setOrderLoading(OrderLoadingStates.IDLE);
    }
  };

  useEffect(() => {
    console.log("Calling All Orders");

    getAllOrders();
  }, []);

  const cancelOrder = (orderId: string) => {
    cancelOrderMutation.mutate(orderId)
  };

  const downloadOrderInvoice = (
    orderId: string,
    products: OrderedProduct[],
  ) => {
    downloadOrderInvoiceMutation.mutate({
      orderId,
      products
    })
  };

  return (
    <OrderContext.Provider
      value={{
        orderLoading,
        proceedToCheckout,
        completeCheckout,
        userTrackOrder,
        getAllOrders,
        pendingOrders,
        cancelledOrders,
        confirmedOrders,
        cancelOrder,
        downloadOrderInvoice,
        setOrdersData,
        ordersData,
        ordersCount,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context)
    throw new Error("useOrderContext must be used within a OrderProvider");
  return context;
};

export { OrderProvider, useOrderContext };
