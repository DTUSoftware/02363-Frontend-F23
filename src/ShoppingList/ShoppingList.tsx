import React, { useState } from "react";
import productsSJSON from "../assets/products.json";
import { FaRegTrashAlt } from "react-icons/fa";
import "./ShoppingList.css";

interface ProductItem {
    id: String;
    name: String;
    price: number;
    currency: String;
    rebateQuantity: number;
    rebatePercent: number;
    upsellProductId: String | null;
}

interface CartItem {
    product: ProductItem,
    quantity: number,
    giftWrap: boolean,
    recurringOrder: boolean,
}

type Products = { [key: string]: ProductItem };

const products: Products = {};
productsSJSON.forEach((x) => (products[x.id] = x));

const itemList = [
    {
        product: products["vitamin-c-500-250"],
        quantity: 2,
        giftWrap: false,
        recurringOrder: false,
    },
    {
        product: products["kids-songbook"],
        quantity: 1,
        giftWrap: true,
        recurringOrder: false,
    },
    {
        product: products["sugar-cane-1kg"],
        quantity: 2,
        giftWrap: false,
        recurringOrder: true,
    },
];

function ShoppingList() {
    const [items, setItems] = useState(itemList);

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

    function removeItem(index: number) {
        setItems(items.filter((p, i) => i != index));
    }

    function toggleGiftWrap(index: number) {
        setItems(
            items.map((x, i) => {
                if (i === index) {
                    return { ...x, giftWrap: !x.giftWrap };
                } else {
                    return x;
                }
            })
        );
    }

    function handleQuantityChange(product: ProductItem, newQuantity: number) {
        setItems(
            items.map((x) => {
                if (x.product.id === product.id) {
                    return { ...x, quantity: newQuantity };
                } else {
                    return x;
                }
            })
        );
    }

    function toggleRecurringOrderSchedule(index: number) {
        setItems(
            items.map((x, i) => {
                if (i === index) {
                    return { ...x, recurringOrder: !x.recurringOrder };
                } else {
                    return x;
                }
            })
        );
    }

    const listEmpty = items === undefined || items.length == 0;

    return (
        <div className="ShoppingList">
            <p className="heading">Din indkøbskurv</p>
            {!listEmpty ? (
                <ProductTable
                    items = {items}
                    decrementQuantity = {decrementQuantity}
                    incrementQuantity = {incrementQuantity}
                    toggleGiftWrap = {toggleGiftWrap}
                    toggleRecurringOrderSchedule = {toggleRecurringOrderSchedule}
                    removeItem = {removeItem}
                />
            ) : (
                <p>Din kurv er tom!</p>
            )}
        </div>
    );
}

function ProductTable({items, decrementQuantity, incrementQuantity, toggleGiftWrap, toggleRecurringOrderSchedule, removeItem}: 
    {items: CartItem[], 
        decrementQuantity: (index: number) => void, 
        incrementQuantity: (index: number) => void,
        toggleGiftWrap: (index: number) => void,
        toggleRecurringOrderSchedule: (index: number) => void,
        removeItem: (index: number) => void
    }) {

    function itemTotal(x: CartItem) {
        const priceSum = x.quantity * x.product!.price;
            if (x.quantity >= x.product!.rebateQuantity) {
                return priceSum*(1-(x.product!.rebatePercent/100));
            } else {
                return priceSum;
            }
    }

    const cartTotal = items.reduce(
        (sum, x) =>  {
            return sum += itemTotal(x);
        },
        0
    );

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
                        <th className="reoccuringorder">
                            Subscription
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((x, index) => 
                        <React.Fragment key={index}>
                            <ProductTableRow
                                index = {index}
                                x = {x}
                                decrementQuantity = {decrementQuantity}
                                incrementQuantity = {incrementQuantity}
                                itemTotal = {itemTotal}
                                toggleGiftWrap = {toggleGiftWrap}
                                toggleRecurringOrderSchedule = {toggleRecurringOrderSchedule}
                                removeItem = {removeItem}
                            />
                        </React.Fragment>
                    )}
                </tbody>
            </table>
            <p className="total">{`Pris i alt ${cartTotal} ${
                items[0].product!.currency
            }`}</p>
        </div>
    );
}

function ProductTableRow({index, x, decrementQuantity, incrementQuantity, itemTotal, toggleGiftWrap, toggleRecurringOrderSchedule, removeItem}: 
    {index: number,
        x: CartItem,
        decrementQuantity: (index: number) => void, 
        incrementQuantity: (index: number) => void,
        itemTotal: (x: CartItem) => number,
        toggleGiftWrap: (index: number) => void,
        toggleRecurringOrderSchedule: (index: number) => void,
        removeItem: (index: number) => void
    }) {

    return (
        <tr>
            <td className="product">{`${
                x.product!.name
            }`}</td>
            <td className="price">{`${
                x.product!.price
            } ${x.product!.currency}`}</td>
            <td className="decrement">
                <button
                    className="quantityBtn"
                    onClick={() =>
                        decrementQuantity(index)
                    }
                >
                    -
                </button>
            </td>
            <td className="quantity"> {x.quantity} </td>
            <td className="increment">
                <button
                    className="quantityBtn"
                    onClick={() =>
                        incrementQuantity(index)
                    }
                >
                    +
                </button>
            </td>
            <td className="rebate">
                {x.product!.rebateQuantity > 0 ? (
                    `Køb ${
                        x.product!.rebateQuantity
                    }, spar ${
                        x.product!.rebatePercent
                    }%`
                ) : ("-")}
            </td>
            <td className="priceTotal">{`${
                itemTotal(x)
            } ${x.product!.currency}`}</td>
            <td className="giftwrapping">
                <label>
                    <input
                        type="checkbox"
                        checked={x.giftWrap}
                        onChange={() =>
                            toggleGiftWrap(index)
                        }
                    />
                </label>
            </td>
            <td className="reoccuringorder">
                <label>
                    <input
                        type="checkbox"
                        checked={x.recurringOrder}
                        onChange={() =>
                            toggleRecurringOrderSchedule(
                                index
                            )
                        }
                    />
                </label>
            </td>
            <td>
                <button
                    onClick={() => removeItem(index)}
                >
                    <FaRegTrashAlt />
                </button>
            </td>
        </tr>
    );
}

export default ShoppingList;
