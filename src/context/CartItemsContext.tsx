import * as React from "react";
import { CartItem } from "../interfaces/CartItem";
import { ProductItem } from "../interfaces/ProductItem";
import { ProductsContext, ProductsContextType } from "./ProductsContext";
import { Products } from "../interfaces/Products";


export type CartItemsContextType = {
    items: CartItem[];
    populatesData: ()=>void
    addItem: (product: ProductItem) => void;    
    removeItem: (index: number) => void;
    handleQuantityChange: (product: ProductItem, newQuantity: number) => void;
    handleUpsellChange: (product: ProductItem, upsell: string) => void;
    toggleGiftWrap: (index: number) => void;
    toggleRecurringOrderSchedule: (index: number) => void;
};

interface Props {
    children: React.ReactNode;
}

//CardItemContext
export const CartItemsContext = React.createContext<CartItemsContextType | null>(null);

const CartItemsProvider: React.FC<Props> = ({ children }): any => {
    
    const {productList}= React.useContext(ProductsContext) as ProductsContextType;
    const [items, setItems] = React.useState<CartItem[]>([]);

    function populatesData(){
        if (items.length === 0) {
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
                setItems(list) ;           
            };            
        }
    }


    function addItem(product: ProductItem){
        if(items.some((item)=>item.product.id === product.id)){
            setItems(
                items.map((item)=> 
                    item.product.id ===product.id ?{
                        ...item, 
                        quantity: item.quantity + 1
                    }:item
                )
            );
            return;
        }else{
            let item : CartItem= {
                product:product,
                quantity:1,
                giftWrap: false,
                recurringOrder:false,
            }
            setItems([...items,item])
        }
        
    }    

    function removeItem(index: number) {
        setItems(items.filter((p, i) => i !== index));
    }

    function handleQuantityChange(product: ProductItem, newQuantity: number) {
        setItems(
            items.map((item) => {
                if (item.product.id === product.id) {
                    return { ...item, quantity: newQuantity };
                } else {
                    return item;
                }
            })
        );
    }

    function handleUpsellChange(product: ProductItem, upsell: string) {
        setItems(
            items.map((item) => {
                if (item.product.id === product.id) {
                    return { ...item, product: productList[upsell] };
                } else {
                    return item;
                }
            })
        );
    }

    function toggleGiftWrap(index: number) {
        setItems(
            items.map((item, i) => {
                if (i === index) {
                    return { ...item, giftWrap: !item.giftWrap };
                } else {
                    return item;
                }
            })
        );
    }

    function toggleRecurringOrderSchedule(index: number) {
        setItems(
            items.map((item, i) => {
                if (i === index) {
                    return { ...item, recurringOrder: !item.recurringOrder };
                } else {
                    return item;
                }
            })
        );
    }


    
    return (
        <CartItemsContext.Provider value={{ items, populatesData, addItem, removeItem, handleQuantityChange, handleUpsellChange, toggleGiftWrap, toggleRecurringOrderSchedule}}>
            {children}
        </CartItemsContext.Provider>
    );
}

export default CartItemsProvider;






