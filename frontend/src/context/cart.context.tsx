import { useCartQuery } from "@/hooks/useCartQuery";
import { CartDetails, CartLoadingStates } from "@/types/main.types";
import { UseQueryResult } from "@tanstack/react-query";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type CartContextType = {
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCart: (productId: string, quantity: number) => void;
  useCartDetails: () => UseQueryResult<CartDetails | null, Error>;
  cartDetails: CartDetails | {};
  setCartDetails: Dispatch<SetStateAction<CartDetails | {}>>;
  cartProductsCount: number;
  setCartProductsCount: Dispatch<SetStateAction<number>>;
  cartLoading: Record<string, CartLoadingStates>;
};

const CartContext = createContext<CartContextType | null>(null);

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartDetails, setCartDetails] = useState<CartDetails | {}>({});
  const [cartProductsCount, setCartProductsCount] = useState(0);
  const [cartLoading, setCartLoading] = useState<
    Record<string, CartLoadingStates>
  >({});
  const { useAddToCart, useUpdateCart, useRemoveFromCart, useCartDetails } =
    useCartQuery();

  const { data: cart } = useCartDetails();

  console.log(cart,"CART");
  

  useEffect(() => {
    if (cart) {      
      setCartProductsCount(cart.products.length);
      setCartDetails(cart);
    }
  }, [cart]);

  const addIntoCartMutation = useAddToCart(setCartLoading); //* Add Product into cart Mutation
  const updateCartMutation = useUpdateCart(setCartLoading); //* Update cart Mutation
  const removeFromCartMutation = useRemoveFromCart(setCartLoading); //* Remove Product from cart Mutation

  //* Cart Related Functions

  const addToCart = (productId: string, quantity: number) => {
    addIntoCartMutation.mutate({
      productId,
      quantity,
    });
  };

  const updateCart = (productId: string, quantity: number) => {
    updateCartMutation.mutate({
      productId,
      quantity,
    });
  };

  const removeFromCart = (productId: string) => {
    removeFromCartMutation.mutate(productId);
  };

  return (
    <CartContext.Provider
      value={{
        addToCart,
        removeFromCart,
        updateCart,
        useCartDetails,
        cartDetails,
        setCartDetails,
        cartProductsCount,
        setCartProductsCount,
        cartLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCartContext must be used within a CartProvider");
  return context;
};

export { CartProvider, useCartContext };
