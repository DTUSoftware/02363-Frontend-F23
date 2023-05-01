import { useContext } from "react";
import { ProductsContext, ProductsContextType } from "../context/ProductsContext";
import { CartItem } from "../interfaces/CartItem";
import { ProductItem } from "../interfaces/ProductItem";

export type CartAction = {type: 'populatesData'} 
                | {type: 'addItem', payload:{product: ProductItem} } 
                | {type: 'removeItem', payload:{index:number} } 
                | {type: 'handleQuantityChange',payload:{product: ProductItem, newQuantity: number} }
                | {type: 'handleUpsellChange',payload:{product: ProductItem, upsell: string} }
                | {type: 'toggleGiftWrap', payload:{index:number} }
                | {type: 'toggleRecurringOrderSchedule', payload:{index:number} }

 
export const cartReducer =(state:CartItem[], action:CartAction): CartItem[] => {
    const {productList}= useContext(ProductsContext) as ProductsContextType;
    switch(action.type){
        case 'populatesData': 
            if (state.length === 0) {
                const p1 = productList["vitamin-c-500-200"];
                const p2 = productList["kids-songbook"];
                const p3 = productList["sugar-cane-1kg"];            
                if (p1 !== undefined && p2 !== undefined && p3 !== undefined) {
                    const list: CartItem[] = [
                        {
                            product: p1,
                            quantity: 2,
                            giftWrap: false,
                            recurringOrder: false,
                        },
                        {
                            product: p2,
                            quantity: 1,
                            giftWrap: true,
                            recurringOrder: false,
                        },
                        {
                            product: p3,
                            quantity: 2,
                            giftWrap: false,
                            recurringOrder: true,
                        },
                    ];
                    state=list;           
                }            
            }
            return state;
        case 'addItem': 
            if(state.some((item)=>item.product.id === action.payload.product.id)){
                return state.map((item)=> 
                        item.product.id ===action.payload.product.id ?{
                            ...item, 
                            quantity: item.quantity + 1
                        }:item
                    )
                ;
            }else{
                let item : CartItem= {
                    product:action.payload.product,
                    quantity:1,
                    giftWrap: false,
                    recurringOrder:false,
                }
                return [...state,item]
            }
        case 'removeItem': return [...state.filter((p,index) => index !== action.payload.index) ]
        case 'handleQuantityChange':
            return state.map((item) => {
                if (item.product.id === action.payload.product.id) {
                    return { ...item, quantity: action.payload.newQuantity };
                } else {
                    return item;
                }
            });
        case 'handleUpsellChange': 
            return state.map((item) => {
                if (item.product.id === action.payload.product.id) {
                    return { ...item, product: productList[action.payload.upsell] };
                } else {
                    return item;
                }
            });
        case 'toggleGiftWrap': 
            return state.map((item, i) => {
                if (i === action.payload.index) {
                    return { ...item, giftWrap: !item.giftWrap };
                } else {
                    return item;
                }
            });
        
        case 'toggleRecurringOrderSchedule': 
            return state.map((item, i) => {
                if (i === action.payload.index) {
                    return { ...item, recurringOrder: !item.recurringOrder };
                } else {
                    return item;
                }
            });
        
        default: return state
    }   
}


