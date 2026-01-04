import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "@/pages/shared"; //* Shared Pages
import {
  AdminSignUpPage,
  AdminSignInPage,
  AdminDashboardPage,
  AdminAddProductPage,
  AdminUpdateProductPage,
  AdminViewProductPage,
  AdminProductsPage,
  AdminForgotPasswordPage,
  AdminResetPasswordPage,
  AdminProfilePage,
  AdminOrdersPage,
  AdminOrderDetailsPage,
} from "@/pages/admin"; //* Admin Pages
import {
  HomePage,
  AboutPage,
  ProductsPage,
  UserSignInPage,
  UserSignUpPage,
  UserDashboardPage,
  UserForgotPasswordPage,
  UserProfilePage,
  UserEmailVerificationPage,
  UserResetPasswordPage,
  CartPage,
  ProductPage,
  WishlistPage,
  CheckoutPage,
  CheckoutSuccessPage,
  TrackOrderPage,
  FaqsPage,
  ContactPage,
  UserOrdersPage,
  UserOrderPage,
} from "@/pages/users"; //* User Pages
import { ThemeProvider } from "@/context/theme.context";
import { UserAuthLayout } from "@/components/layout/user";
import { AdminAuthLayout, AdminRoot } from "@/components/layout/admin";
import { AuthProvider } from "@/context/auth.context";
import { ProductProvider } from "@/context/product.context";
import { cartLoader } from "@/utils/loaders/cartLoader";
import {
  CartErrorPage,
  CheckoutErrorPage,
  CheckoutSuccessErrorPage,
  ProductDetailsErrorPage,
  TrackOrderErrorPage,
  UserOrderErrorPage,
} from "@/pages/users/error";
import WishlistErrorPage from "./pages/users/error/WishlistErrorPage";
import {
  confirmOrderDetailsLoader,
  pendingOrderDetailsLoader,
  singleOrderDetailsLoader,
  userTrackOrderLoader,
} from "./utils/loaders/orderDetailsLoader";
import { OrderProvider } from "./context/order.context";
import { ActivityProvider } from "./context/activity.context";
import { Toaster } from "sonner";
import { adminOrderDetailsLoader } from "./utils/loaders/adminLoaders/orderDetailsLoader";
import {
  AdminOrderErrorPage,
  AdminProductDetailsErrorPage,
} from "./pages/admin/error";
import { singleProductDetailsLoader } from "./utils/loaders/adminLoaders/adminProductLoaders";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/tanstackQueryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { productDetailsLoader } from "./utils/loaders/productLoader";
import { CartProvider } from "./context/cart.context";
import { WishlistProvider } from "./context/wishlist.context";

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />, //! Error Page (Shared Page)
  },
  //! Public Routes (No Auth Required For Users)
  {
    path: "/",
    element: (
      <AdminAuthLayout authenticationRequired={false}>
        <HomePage />
      </AdminAuthLayout>
    ),
  },
  {
    path: "/sign-in",
    element: (
      <UserAuthLayout authenticationRequired={false}>
        <AdminAuthLayout authenticationRequired={false}>
          <UserSignInPage />
        </AdminAuthLayout>
      </UserAuthLayout>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <UserAuthLayout authenticationRequired={false}>
        <AdminAuthLayout authenticationRequired={false}>
          <UserSignUpPage />
        </AdminAuthLayout>
      </UserAuthLayout>
    ),
  },
  {
    path: "/user/verify/:email/:token",
    element: (
      <UserAuthLayout authenticationRequired={false}>
        <UserEmailVerificationPage />
      </UserAuthLayout>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <UserAuthLayout authenticationRequired={false}>
        <UserForgotPasswordPage />
      </UserAuthLayout>
    ),
  },
  {
    path: "/user/reset-password",
    element: (
      <UserAuthLayout authenticationRequired={false}>
        <UserResetPasswordPage />
      </UserAuthLayout>
    ),
  },
  {
    path: "/about",
    element: (
      <AdminAuthLayout authenticationRequired={false}>
        <AboutPage />
      </AdminAuthLayout>
    ),
  },
  {
    path: "/contact",
    element: (
      <AdminAuthLayout authenticationRequired={false}>
        <ContactPage />
      </AdminAuthLayout>
    ),
  },
  {
    path: "/faqs",
    element: (
      <AdminAuthLayout authenticationRequired={false}>
        <FaqsPage />
      </AdminAuthLayout>
    ),
  },
  {
    path: "/products",
    element: (
      <AdminAuthLayout authenticationRequired={false}>
        <ProductsPage />
      </AdminAuthLayout>
    ),
  },
  {
    path: "/products/:productId",
    element: (
      <AdminAuthLayout authenticationRequired={false}>
        <ProductPage />
      </AdminAuthLayout>
    ),
    loader: productDetailsLoader,
    errorElement: <ProductDetailsErrorPage />,
  },

  //! Protected Routes (Require Auth For Users)
  {
    path: "/dashboard",
    element: (
      <UserAuthLayout authenticationRequired={true}>
        <UserDashboardPage />
      </UserAuthLayout>
    ),
  },
  {
    path: "/me",
    element: (
      <UserAuthLayout authenticationRequired={true}>
        <UserProfilePage />
      </UserAuthLayout>
    ),
  },
  {
    path: "/cart",
    element: (
      <UserAuthLayout authenticationRequired>
        <CartPage />
      </UserAuthLayout>
    ),
    errorElement: <CartErrorPage />,
  },
  {
    path: "/orders",
    element: (
      <UserAuthLayout authenticationRequired>
        <UserOrdersPage />
      </UserAuthLayout>
    ),
  },
  {
    path: "/orders/:orderId",
    element: (
      <UserAuthLayout authenticationRequired>
        <UserOrderPage />
      </UserAuthLayout>
    ),
    loader: singleOrderDetailsLoader,
    errorElement: <UserOrderErrorPage />,
  },
  {
    path: "/checkout",
    element: (
      <UserAuthLayout authenticationRequired>
        <CheckoutPage />
      </UserAuthLayout>
    ),
    loader: pendingOrderDetailsLoader,
    errorElement: <CheckoutErrorPage />,
  },
  {
    path: "/checkout/success",
    element: (
      <UserAuthLayout authenticationRequired>
        <CheckoutSuccessPage />
      </UserAuthLayout>
    ),
    loader: confirmOrderDetailsLoader,
    errorElement: <CheckoutSuccessErrorPage />,
  },
  {
    path: "/track-order",
    element: (
      <UserAuthLayout authenticationRequired>
        <TrackOrderPage />
      </UserAuthLayout>
    ),
    loader: userTrackOrderLoader,
    errorElement: <TrackOrderErrorPage />,
  },
  {
    path: "/wishlist",
    element: (
      <UserAuthLayout authenticationRequired>
        <WishlistPage />
      </UserAuthLayout>
    ),
    // loader: wishlistLoader,
    errorElement: <WishlistErrorPage />,
  },

  //! Public Routes (No Auth Required For Admin)
  {
    path: "/admin/sign-up",
    element: (
      <AdminAuthLayout authenticationRequired={false}>
        <UserAuthLayout authenticationRequired={false}>
          <AdminSignUpPage />
        </UserAuthLayout>
      </AdminAuthLayout>
    ),
  },
  {
    path: "/admin/sign-in",
    element: (
      <AdminAuthLayout authenticationRequired={false}>
        <UserAuthLayout authenticationRequired={false}>
          <AdminSignInPage />
        </UserAuthLayout>
      </AdminAuthLayout>
    ),
  },
  {
    path: "/admin/forgot-password",
    element: <AdminForgotPasswordPage />,
  },
  {
    path: "/admin/reset-password",
    element: <AdminResetPasswordPage />,
  },
  //! Protected Routes (Require Auth for Admins)
  {
    path: "/admin",
    element: <AdminRoot />,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboardPage />,
      },
      {
        path: "products",
        element: <AdminProductsPage />,
      },
      {
        path: "products/add",
        element: <AdminAddProductPage />,
      },
      {
        path: "products/edit/:id",
        element: <AdminUpdateProductPage />,
        loader: singleProductDetailsLoader,
        errorElement: <AdminProductDetailsErrorPage />,
      },
      {
        path: "products/product/:id",
        element: <AdminViewProductPage />,
        loader: singleProductDetailsLoader,
        errorElement: <AdminProductDetailsErrorPage />,
      },
      {
        path: "me",
        element: <AdminProfilePage />,
      },
      {
        path: "orders",
        element: <AdminOrdersPage />,
      },
      {
        path: "orders/:orderId",
        element: <AdminOrderDetailsPage />,
        loader: adminOrderDetailsLoader,
        errorElement: <AdminOrderErrorPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
      <AuthProvider>
        <ProductProvider>
          <WishlistProvider>
            <CartProvider>
              <OrderProvider>
                <ActivityProvider>
                  <RouterProvider router={router} />
                  <Toaster />
                </ActivityProvider>
              </OrderProvider>
            </CartProvider>
          </WishlistProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>,
  // </StrictMode >
);
