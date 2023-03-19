import { Address } from "./Address";
import { CartItem } from "./CartItem";

export interface Order {
    cartItems: CartItem[];
    billingAddress: Address;
    shippingAddress: Address;
    checkMarketing: boolean;
    submitComment: string; 
}