import { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import "./ShoppingList.css";
import { Link } from "react-router-dom";
import { ProductItem } from '../interfaces/ProductItem';
import { CartItem } from '../interfaces/CartItem';
import useFetchData from "../hooks/useFetchData";

type Products = { [key: string]: ProductItem };

const dataUrl = "https://raw.githubusercontent.com/larsthorup/checkout-data/main/product-v2.json";

function ShoppingList({items, setItems} : {items: CartItem[], setItems: (items: CartItem[]) => void }) {
    const {isLoading, data, error}= useFetchData<ProductItem[]>(dataUrl,[])

    const [productList, setList]= useState<Products>({})

    useEffect(()=>{
        const products: Products = {};  

        data.forEach((product) => {
            products[product.id] = product;
        })

        setList(products);
    },[data])

    // Populates cart with dummy items
    useEffect(()=>{
        if (items.length === 0) {
            const p1= productList["vitamin-c-500-200"];
            const p2= productList["kids-songbook"]
            const p3=  productList["sugar-cane-1kg"]
            if(p1 != undefined && p2 != undefined && p3 != undefined){
                const list:CartItem[]=[
                    {
                    product: p1,
                    quantity: 2,
                    giftWrap: false,
                    recurringOrder: false
                },
                {
                    product: p2,
                    quantity: 1,
                    giftWrap: true,
                    recurringOrder: false
                },
                {
                    product:p3,
                    quantity: 2,
                    giftWrap: false,
                    recurringOrder: true
                }
            ];
            setItems(list);
            }
        }
    },[productList])

    function incrementQuantity(index: number) {
        const item = items.at(index)!;
        handleQuantityChange(item.product, item.quantity + 1);
    }

    function decrementQuantity(index: number) {
        const item = items.at(index)!;
        if (item.quantity > 1) {
            handleQuantityChange(item.product, item.quantity - 1);
        }
    }

    function upsellItem(index: number){
        const item = items.at(index)!;
        if (item.product.upsellProductId != null){
            const upsell = `${item.product.upsellProductId}`;
            handleUpsellChange(item.product, upsell)
        }
    }

    function removeItem(index: number) {
        setItems(items.filter((p, i) => i != index));
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

    function handleUpsellChange(product: ProductItem, upsell: string){
        setItems(
            items.map((item) =>{
                if (item.product.id === product.id){
                    return {...item, product: productList[upsell]};
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

    const listEmpty = items === undefined || items.length === 0;
    return (
        <div className="ShoppingList">
            {!listEmpty && <div>
            <p className="deliveryheading">Køb for 499 DKK og få FRI fragt!</p>
            <p className="deliveryheading">Køb for over 300 DKK og få 10% rabat!</p>
            </div>}
            <p className="heading">Din indkøbskurv</p>
            {!listEmpty ? (
                <ProductTable
                    items={items}
                    decrementQuantity={decrementQuantity}
                    incrementQuantity={incrementQuantity}
                    toggleGiftWrap={toggleGiftWrap}
                    toggleRecurringOrderSchedule={toggleRecurringOrderSchedule}
                    removeItem={removeItem}
                    upsellItem={upsellItem}
                />
            ) : (
                <p className="empty">Din kurv er tom!</p>
            )}
        </div>
    );
}

function ProductTable({
    items,
    decrementQuantity,
    incrementQuantity,
    toggleGiftWrap,
    toggleRecurringOrderSchedule,
    removeItem,
    upsellItem,
}: {
    items: CartItem[];
    decrementQuantity: (index: number) => void;
    incrementQuantity: (index: number) => void;
    toggleGiftWrap: (index: number) => void;
    toggleRecurringOrderSchedule: (index: number) => void;
    removeItem: (index: number) => void;
    upsellItem: (index: number) => void;
}) {
    function itemTotal(item: CartItem) {
        const priceSum = item.quantity * item.product!.price;
        if (item.quantity >= item.product!.rebateQuantity) {
            return priceSum * (1 - item.product!.rebatePercent / 100);
        } else {
            return priceSum;
        }
    }

    return (
        <div className="shopTable">
            <table>
                <thead>
                    <tr>
                        <th className="product">Produkt</th>
                        <th className="price">Pris</th>
                        <th> </th>
                        <th className="quantity">Antal</th>
                        <th> </th>
                        <th className="rebate">Rabat</th>
                        <th className="priceTotal">Total</th>
                        <th className="giftwrapping">Gavepapir</th>
                        <th className="reoccuringorder">Gentag order</th>
                        <th ></th>
                        <th className="upsell">Andre populære valg</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <ProductTableRow
                            key={index}
                            item={item}
                            decrementQuantity={() => decrementQuantity(index)}
                            incrementQuantity={() => incrementQuantity(index)}
                            itemTotal={() => itemTotal(item)}
                            toggleGiftWrap={() => toggleGiftWrap(index)}
                            toggleRecurringOrderSchedule={() =>
                                toggleRecurringOrderSchedule(index)
                            }
                            removeItem={() => removeItem(index)}
                            upsellItem={() => upsellItem(index)}
                        />
                    ))}
                </tbody>
            </table>
            <CartTotal items={items} itemTotal={itemTotal} />
            <br />
            <Link className="order-btn" to="/delivery">
                Bestil produkter
            </Link>
        </div>
    );
}


function CartTotal({
    items,
    itemTotal,
}: {
    items: CartItem[];
    itemTotal: (item: CartItem) => number;
}) {
    const shippingPrice = 39;
    const freeShipping = 499;
    const totalRebate = 0.1;
    const cartTotal: number = items.reduce((sum, item) => {
        return (sum += itemTotal(item));
    }, 0);
    const hasRebate = cartTotal>=300;
    
    return (
        <p className="total">
            <span className="rebatetext"> {`Subtotal: ${cartTotal} DKK`}</span>
            <br/>
            <span className="rebatetext"> {cartTotal>=freeShipping ? "FRI FRAGT" : `Fragt: ${shippingPrice} DKK`}</span>
            <br/>
            <span className="rebatetext"> {hasRebate ? `Du sparer 10%:  ${cartTotal*totalRebate} DKK` : "Spar 10% ved køb over 300 DKK"}</span>
            <br/>
            <span className="totalprice">{`Pris i alt: ${hasRebate ? cartTotal*(1-totalRebate)+shippingPrice : cartTotal} ${items[0].product!.currency}`}</span>
        </p>
    );
}

function ProductTableRow({
    item,
    decrementQuantity,
    incrementQuantity,
    itemTotal,
    toggleGiftWrap,
    toggleRecurringOrderSchedule,
    removeItem,
    upsellItem,
}: {
    item: CartItem;
    decrementQuantity: () => void;
    incrementQuantity: () => void;
    itemTotal: () => number;
    toggleGiftWrap: () => void;
    toggleRecurringOrderSchedule: () => void;
    removeItem: () => void;
    upsellItem: () => void;
}) {
    return (
        <tr>
            <td className="product">{`${item.product!.name}`}</td>
            <td className="price" aria-label={`Pris ${item.product!.price} ${
                item.product!.currency
            }`}>{`${item.product!.price} ${
                item.product!.currency
            }`}</td>
            <td className="decrement">
                <button
                    aria-label={`reducer antal ${item.product.name}`}
                    className="quantityBtn"
                    onClick={() => decrementQuantity()}
                >
                    -
                </button>
            </td>
            <td className="quantity"> {item.quantity} </td>
            <td className="increment">
                <button
                    aria-label={`forøg antal ${item.product.name}`}
                    className="quantityBtn"
                    onClick={() => incrementQuantity()}
                >
                    +
                </button>
            </td>
            <td className="rebate">
                {item.product!.rebateQuantity > 0
                    && `Køb ${item.product!.rebateQuantity}, spar ${
                          item.product!.rebatePercent
                      }%`}
            </td>
            <td className="priceTotal">{`${itemTotal()} ${
                item.product!.currency
            }`}</td>
            <td className="giftwrapping">
                <label>
                    <input
                        aria-label={`gavepapir ${item.product.name} ${item.giftWrap}`}
                        type="checkbox"
                        checked={item.giftWrap}
                        onChange={() => toggleGiftWrap()}
                    />
                </label>
            </td>
            <td className="reoccuringorder">
                <label>
                    <input
                        aria-label={`gentag order ${item.product.name} ${item.recurringOrder}`}
                        type="checkbox"
                        checked={item.recurringOrder}
                        onChange={() => toggleRecurringOrderSchedule()}
                    />
                </label>
            </td>
            <td className="trash">
                <button
                    aria-label={`fjern ${item.product.name}`}
                    onClick={() => removeItem()}
                >
                    <FaRegTrashAlt />
                </button>
            </td>
            <td>{item.product!.upsellProductId !== null &&
                <button 
                className="upsellBtn"
                aria-label={`Andre har valgt ${item.product.upsellProductId}`}
                onClick={()=> upsellItem()}
                >
                    {`${item.product!.upsellProductId}`}
                </button>
}
            </td>
        </tr>
    );
}

export default ShoppingList;
