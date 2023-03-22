import { useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import "./ShoppingList.css";
import { Link } from "react-router-dom";
import { CartItem } from "../interfaces/CartItem";
import { Products } from "../interfaces/Products";
import { ProductItem } from "../interfaces/ProductItem";

function ShoppingList({
    items,
    setItems,
    productList,
}: {
    items: CartItem[];
    setItems: (items: CartItem[]) => void;
    productList: Products;
}) {
    // Populates cart with dummy items
    useEffect(() => {
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
                setItems(list);
            }
        }
    }, []);

    function incrementQuantity(index: number) {
        const item = items.at(index);
        if (item !== undefined) {
            handleQuantityChange(item.product, item.quantity + 1);
        }
    }

    function decrementQuantity(index: number) {
        const item = items.at(index);
        if (item !== undefined && item.quantity > 1) {
            handleQuantityChange(item.product, item.quantity - 1);
        }
    }

    function upsellItem(index: number) {
        const item = items.at(index);
        if (item !== undefined && item.product.upsellProductId !== null) {
            const upsell = `${item.product.upsellProductId}`;
            handleUpsellChange(item.product, upsell);
        }
    }

    function removeItem(index: number) {
        setItems(items.filter((p, i) => i !== index));
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
            {!listEmpty && (
                <div>
                    <h1 className="delivery-heading">
                        Køb for 499 DKK og få FRI fragt!
                    </h1>

                </div>
            )}
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
        const priceSum = item.quantity * item.product.price;
        if (item.quantity >= item.product.rebateQuantity) {
            return priceSum * (1 - item.product.rebatePercent / 100);
        } else {
            return priceSum;
        }
    }

    return (
        <><div className="shop-table">
            <table>
                <caption>Din indkøbskurv</caption>
                <thead>
                    <tr>
                        <th className="product-heading">Produkt</th>
                        <th> </th>
                        <th className="quantity-heading">Antal</th>
                        <th> </th>
                        {/*<th className="rebate">Rabat</th>*/}
                        <th className="priceTotal-heading">Total</th>
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
                            toggleRecurringOrderSchedule={() => toggleRecurringOrderSchedule(index)}
                            removeItem={() => removeItem(index)}
                            upsellItem={() => upsellItem(index)} />
                    ))}
                </tbody>
            </table>
        </div>

        <div className="upsell-table">
            <table>
                <caption className="upsell-heading">Der er varer i din kurv der kan erstattes</caption>
                <tbody>
                    {items.map((item, index) => (
                            <UpsellItems
                                key={index}
                                item={item}
                                upsellItem={() => upsellItem(index)} />
                    ))}
                </tbody>
            </table>
        </div>

        <div className="cart-total">
        <CartTotal items={items} itemTotal={itemTotal} />
            <Link className="order-btn" to="/delivery">
                <button>Gå til levering</button>
            </Link>
        </div></>
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
    const hasRebate = cartTotal >= 300;

    return (
        <p className="total">
            <span className="rebatetext">
                {" "}
                {`Subtotal: ${cartTotal.toFixed(2)} DKK`}
            </span>
            <br />
            <span className="rebatetext">
                {" "}
                {cartTotal >= freeShipping
                    ? "FRI FRAGT"
                    : `Fragt: ${shippingPrice.toFixed(2)} DKK`}
            </span>
            <br />
            <span className="rebatetext">
                {" "}
                {hasRebate
                    ? `Du sparer 10%:  ${(cartTotal * totalRebate).toFixed(
                          2
                      )} DKK`
                    : "Spar 10% ved køb over 300 DKK"}
            </span>
            <br />
            <span className="totalprice">{`Pris i alt: ${
                hasRebate
                    ? (cartTotal * (1 - totalRebate) + shippingPrice).toFixed(2)
                    : cartTotal.toFixed(2)
            } ${items[0].product.currency}`}</span>
        </p>
    );
}

function UpsellItems ({
    item,
    upsellItem
} : {
    item: CartItem;
    upsellItem: () => void;
}) {
    return (
        <tr className="upsell-content">
            <td>
            <div>
            <div className="upsell-picture">
                <img className="upsell-picture" src={item.product!.imageUrl}></img>
            </div>
            {item.product.upsellProductId !== null && (
            <button
                className="upsellBtn"
                aria-label={`Andre har valgt ${item.product.upsellProductId}`}
                onClick={() => upsellItem()}
            >
                Erstat vare
            </button>
        )}
            </div>
        </td>
    </tr>
    )
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
            <td rowSpan={2} className="product">
                <div className="picture">
                    <img className="picture" src={item.product!.imageUrl}></img>
                </div>
                <span className="product-info">
                    <p className="product-name">{`${item.product!.name}`}</p>
                    <span className="discount-container">
                        <p className="discount">
                            {item.product!.rebateQuantity > 0 &&
                                `Køb ${item.product!.rebateQuantity}, spar ${item.product!.rebatePercent}%`}
                        </p>
                    </span>
                    <p className="product-price"
                        aria-label={`Pris ${item.product!.price.toFixed(2)} ${item.product!.currency}`}
                    >{`${item.product!.price} ${item.product!.currency}`}</p>
                    <span className="input">
                        <div className="giftwrapping">
                            <label>
                                <p className="gift">Gave</p>
                                <input
                                    aria-label={`gavepapir ${item.product.name} ${item.giftWrap}`}
                                    type="checkbox"
                                    checked={item.giftWrap}
                                    onChange={() => toggleGiftWrap()} />
                            </label>
                        </div>
                        <div className="reoccuringorder">
                            <label>
                                <p className="subscription">Abbonnér</p>
                                <input
                                    aria-label={`gentag order ${item.product.name} ${item.recurringOrder}`}
                                    type="checkbox"
                                    checked={item.recurringOrder}
                                    onChange={() => toggleRecurringOrderSchedule()} />
                            </label>
                        </div>
                    </span>
                </span>
            </td>
                <td>
                    <span className="quantity-container">
                        <button
                            aria-label={`reducer antal ${item.product.name}`}
                            className="decrement-quantityBtn"
                            onClick={() => decrementQuantity()}
                        >
                            -
                        </button>
                        <p className="quantity"> {item.quantity} </p>
                        <button
                            aria-label={`forøg antal ${item.product.name}`}
                            className="increment-quantityBtn"
                            onClick={() => incrementQuantity()}
                        >
                            +
                        </button>
                    </span>
                </td>
                {/*<td className="decrement">
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
            </td>*/}
                <td className="price-total">{`${itemTotal().toFixed(2)} ${item.product!.currency}`}</td>
                <td className="trash">
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
