import { createContext, useContext, useReducer } from "react";
import { CartItem  } from "../interfaces/CartItem";
import React from "react";
import  { cartReducer, CartAction } from "../reducer/reducer";

const initialState:CartItem[]=[]

const CartContext = createContext<CartItem[] | null>(null);

export const CartDispatchContext = createContext<React.Dispatch<CartAction> | null>(null);


type CartProps = React.PropsWithChildren<{cartState?: CartItem[]}>; 

export function CartProvider( {children,  cartState: explicitMyState}:CartProps) {
    const [items, dispatch] = useReducer( cartReducer, explicitMyState || initialState);

    return (
        <CartContext.Provider value={items}>            
            <CartDispatchContext.Provider value={dispatch}>
                {children}
            </CartDispatchContext.Provider>
        </CartContext.Provider>
    );
}


// state hook
export function useCartState() {
    const cartState = useContext(CartContext);
    if (cartState === null) {
      throw new Error("Unexpected useCartState without parent <CartItemProvider>");
    }
    return cartState;
}

// dispatch hook
export function useCartDispatch() {
    const dispatch = useContext(CartDispatchContext);
    if (dispatch === null) {
      throw new Error(
        "Unexpected useCartDispatch without parent <CartItemProvider>"
      );
    }
    return dispatch;
}

