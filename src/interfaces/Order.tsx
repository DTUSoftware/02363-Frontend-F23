import { Address } from "./Address";

export interface Order {
    orderDetails: SubmitCartItem[];
    billingAddress: Address;
    shippingAddress: Address;
    checkMarketing: boolean;
    submitComment: string; 
}

interface SubmitCartItem {
    productId: string;
    quantity: number;
    giftWrap: boolean;
    recurringOrder: boolean;
}