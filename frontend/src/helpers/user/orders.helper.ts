import {
  cancelOrder,
  completeCheckout,
  downloadOrderInvoice,
  proceedToCheckout,
  userTrackOrder,
} from "@/API/userApi";
import { ApiErrorType, CompleteCheckoutBody, CompleteCheckoutReturnBody, OrderedProduct } from "@/types/main.types";
import { errorToast, successToast } from "@/utils/toastNotifications";
import { AxiosError } from "axios";

const proceedToCheckoutHelper = async (navigate: (path: string) => void) => {
  try {
    const res = await proceedToCheckout();
    if (res.status === 200) {
      setTimeout(() => {
        navigate("/checkout")
      }, 500);
    };
  } catch (error) {
    const err = error as AxiosError<ApiErrorType>;
    const errMsg = err.response?.data.message || "Something went wrong";
    errorToast(errMsg);
    throw err;
  }
};

const userTrackOrderHelper = async ({
  navigate,
  orderId,
}: {
  orderId: string;
  navigate: (path: string) => void;
}) => {
  try {
    const res = await userTrackOrder(orderId);

    if (res.status === 200) {
      successToast(res.data.message);
      navigate(`/track-order?orderId=${res.data.data.orderId}`);
    }
  } catch (error) {
    const err = error as AxiosError<ApiErrorType>;
    const errMsg = err.response?.data.message || "Something went wrong";
    errorToast(errMsg);
    throw err;
  }
};

const completeCheckoutHelper = async (checkoutBody: CompleteCheckoutBody) => {
  try {
    const res = await completeCheckout(checkoutBody);    
    if (res.status === 200) return res.data.data as CompleteCheckoutReturnBody;
    return null;
  } catch (error) {
    const err = error as AxiosError<ApiErrorType>;
    console.log('error',err);
    
    const errMsg = err.response?.data.message || "Something went wrong";
    errorToast(errMsg);
    throw err;
  }
};


const cancelOrderHelper = async (orderId: string) => {
  try {
    const res = await cancelOrder(orderId);
    if (res.status === 200) {
      successToast(res.data.message);
    }
  } catch (error) {
    const err = error as AxiosError<ApiErrorType>;
    const errMsg = err.response?.data.message || "Something went wrong";
    errorToast(errMsg);
    throw err;
  }
};


const downloadOrderInvoiceHelper = async (
  { orderId,
    products
  }: {
    orderId: string,
    products: OrderedProduct[]
  },
) => {
  try {
    const res = await downloadOrderInvoice(orderId, products);
    if (res.status === 200) {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      successToast("Invoice downloaded!");
    }
  } catch (error) {
    const err = error as AxiosError<ApiErrorType>;
    const errMsg = err.response?.data.message || "Something went wrong";
    errorToast(errMsg);
    throw err;
  }
};

export {
  proceedToCheckoutHelper,
  userTrackOrderHelper,
  completeCheckoutHelper,
  cancelOrderHelper,
  downloadOrderInvoiceHelper
};
