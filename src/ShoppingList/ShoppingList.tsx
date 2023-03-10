import React, { useState } from "react";
import productsSJSON from "../assets/products.json";
import { FaRegTrashAlt } from "react-icons/fa";
import "./ShoppingList.css";
import { Link } from "react-router-dom";
import { ProductItem } from "../interfaces/ProductItem";
import { CartItem } from "../interfaces/CartItem";

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
            <p className="heading">Din indkøbskurv</p>
            {!listEmpty ? (
                <ProductTable
                    items={items}
                    decrementQuantity={decrementQuantity}
                    incrementQuantity={incrementQuantity}
                    toggleGiftWrap={toggleGiftWrap}
                    toggleRecurringOrderSchedule={toggleRecurringOrderSchedule}
                    removeItem={removeItem}
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
}: {
    items: CartItem[];
    decrementQuantity: (index: number) => void;
    incrementQuantity: (index: number) => void;
    toggleGiftWrap: (index: number) => void;
    toggleRecurringOrderSchedule: (index: number) => void;
    removeItem: (index: number) => void;
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
    const cartTotal = items.reduce((sum, item) => {
        return (sum += itemTotal(item));
    }, 0);

    return (
        <p className="total">{`Pris i alt ${cartTotal} ${
            items[0].product!.currency
        }`}</p>
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
}: {
    item: CartItem;
    decrementQuantity: () => void;
    incrementQuantity: () => void;
    itemTotal: () => number;
    toggleGiftWrap: () => void;
    toggleRecurringOrderSchedule: () => void;
    removeItem: () => void;
}) {
    return (
        <tr>
            <td className="product">{`${item.product!.name}`}</td>
            <td className="price">{`${item.product!.price} ${
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
                    ? `Køb ${item.product!.rebateQuantity}, spar ${
                          item.product!.rebatePercent
                      }%`
                    : "-"}
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
            <td>
                <button
                    aria-label={`fjern ${item.product.name}`}
                    onClick={() => removeItem()}
                >
                    <FaRegTrashAlt />
                </button>
            </td>
        </tr>
    );
}

export default ShoppingList;
