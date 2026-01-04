import { ApiErrorType, OrderLoadingStates, QueryKeys } from "@/types/main.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cancelOrderHelper,
  completeCheckoutHelper,
  downloadOrderInvoiceHelper,
  proceedToCheckoutHelper,
  userTrackOrderHelper,
} from "@/helpers/user/orders.helper";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

const useOrderQuery = () => {
  const queryClient = useQueryClient();

  const useProceedToCheckout = (
    setOrderLoading: Dispatch<SetStateAction<OrderLoadingStates>>,
  ) => {
    return useMutation({
      mutationFn: proceedToCheckoutHelper,
      onMutate: () => setOrderLoading(OrderLoadingStates.PROCEED_TO_CHECKOUT),
      onSettled: () => setOrderLoading(OrderLoadingStates.IDLE),
    });
  };

  const useCompleteCheckout = (
    setOrderLoading: Dispatch<SetStateAction<OrderLoadingStates>>,
  ) => {
    return useMutation({
      mutationFn: completeCheckoutHelper,
      onMutate: () => setOrderLoading(OrderLoadingStates.COMPLETE_CHECKOUT),
      onSettled: () => setOrderLoading(OrderLoadingStates.IDLE),
    })
  }

  const useUserTrackOrder = (
    setOrderLoading: Dispatch<SetStateAction<OrderLoadingStates>>,
  ) => {
    return useMutation({
      mutationFn: userTrackOrderHelper,
      onMutate: () => setOrderLoading(OrderLoadingStates.TRACK_ORDER),
      onSettled: () => setOrderLoading(OrderLoadingStates.IDLE),
    });
  };

  const useCancelOrder = (
    setOrderLoading: Dispatch<SetStateAction<OrderLoadingStates>>,

  ) => {
    return useMutation({
      mutationFn: cancelOrderHelper,
      onMutate: () => setOrderLoading(OrderLoadingStates.CANCEL_ORDER),
      onSettled: () => setOrderLoading(OrderLoadingStates.IDLE)
    })
  }

  const useDownLoadOrderInvoice = (
    setOrderLoading: Dispatch<SetStateAction<OrderLoadingStates>>,

  ) => {
    return useMutation({
      mutationFn: downloadOrderInvoiceHelper,
      onMutate: () => setOrderLoading(OrderLoadingStates.DOWNLOAD_INVOICE),
      onSettled: () => setOrderLoading(OrderLoadingStates.IDLE)
    })
  }

  return {
    useProceedToCheckout,
    useCompleteCheckout,
    useUserTrackOrder,
    useCancelOrder,
    useDownLoadOrderInvoice
  };
};

export { useOrderQuery };
