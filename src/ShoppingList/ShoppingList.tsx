import { useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import "./ShoppingList.css";
import { CartItem } from "../interfaces/CartItem";
import { Products } from "../interfaces/Products";
import { ProductItem } from "../interfaces/ProductItem";
import { routes } from "../Navigation/RoutePaths";
import navigate from "../Navigation/navigate";

function ShoppingList({
    items,
    setItems,
    productList
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
    //if(isLoading){ return( <h1> <BeatLoader size={34} color='#dc62ab' />  Produkter loader...</h1>) }
    //else if(error != null) {return (<h1> {error} </h1>)}
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
                    productList={productList}
                />
            ) : (
                <p className="emptyshoplist">Din kurv er tom!</p>
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
    productList,
}: {
    items: CartItem[];
    decrementQuantity: (index: number) => void;
    incrementQuantity: (index: number) => void;
    toggleGiftWrap: (index: number) => void;
    toggleRecurringOrderSchedule: (index: number) => void;
    removeItem: (index: number) => void;
    upsellItem: (index: number) => void;
    productList: Products;
}) {
    const itemTotal = (item: CartItem) => {
        const priceSum = item.quantity * item.product.price;
        if (item.quantity >= item.product.rebateQuantity) {
            return priceSum * (1 - item.product.rebatePercent / 100);
        } else {
            return priceSum;
        }
    };

    const hasUpsellProducts = () => {
        let upsellItemsExsist = false;
        items.forEach((item) => {
            if (item.product.upsellProductId !== null) {
                upsellItemsExsist = true;
            }
        });
        return upsellItemsExsist;
    };

    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        navigate(routes.delivery.routePath);
    };

    return (
        <>
            <div className="shop-table">
                <table>
                    <caption className="stop-caption">Din indkøbskurv</caption>
                    <thead>
                        <tr>
                            <th className="product-heading">Produkt</th>
                            <th className="quantity-heading">Antal</th>
                            <th className="priceTotal-heading">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <ProductTableRow
                                key={index}
                                item={item}
                                decrementQuantity={() =>
                                    decrementQuantity(index)
                                }
                                incrementQuantity={() =>
                                    incrementQuantity(index)
                                }
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
            </div>

            <div className="upsell-table">
                <table>
                    <caption className="upsell-heading">
                        Varer som andre kunder har set på
                    </caption>
                    <tbody>
                        {items.map((item, index) => (
                            <UpsellItems
                                key={index}
                                item={item}
                                upsellItem={() => upsellItem(index)}
                                productList={productList}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="cart-total">
                <CartTotal items={items} itemTotal={itemTotal} />
                <br />
                <button className="order-btn" onClick={onClick}>
                    Gå til levering
                </button>
            </div>
        </>
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
    const currency = items[0].product.currency;
    const subtotal = cartTotal.toFixed(2);
    const shipping = shippingPrice.toFixed(2);
    const rebate = (cartTotal * totalRebate).toFixed(2);
    const totalWithRebate = (
        cartTotal * (1 - totalRebate) +
        shippingPrice
    ).toFixed(2);

    return (
        <p className="total">
            <span className="text-left">Subtotal</span>
            <span
                className="text-right"
                aria-label={`Subtotal ${subtotal} ${currency}`}
            >{`${subtotal} ${currency}`}</span>
            <br />
            <span className="text-left"> Fragt</span>
            <span className="text-right">
                {cartTotal >= freeShipping
                    ? "FRI FRAGT"
                    : ` ${shipping} ${currency}`}
            </span>
            <br />
            <span className="text-right">
                {hasRebate
                    ? `Du sparer 10% ${rebate} ${currency}`
                    : `Spar 10% ved køb over 300 ${currency}`}
            </span>
            <br />
            <span className="text-left">Pris i alt</span>
            <span
                className="text-right"
                aria-label={`Pris i alt ${
                    hasRebate ? totalWithRebate : cartTotal.toFixed(2)
                } ${currency}`}
            >
                {`${
                    hasRebate ? totalWithRebate : cartTotal.toFixed(2)
                } ${currency}`}
            </span>
        </p>
    );
}

function UpsellItems({
    item,
    upsellItem,
    productList,
}: {
    item: CartItem;
    upsellItem: () => void;
    productList: Products;
}) {
    const upsellProduct =
        item.product.upsellProductId !== null
            ? productList[item.product.upsellProductId]
            : null;

    if (upsellProduct !== null) {
        return (
            <tr className="upsell-content">
                <td>
                    <div>
                        <div className="upsell-picture">
                            <img
                                className="upsell-picture"
                                alt={`Billede af ${upsellProduct.name}`}
                                src={upsellProduct.imageUrl}
                            ></img>
                        </div>
                        <button
                            className="upsellBtn"
                            aria-label={`Andre har valgt ${upsellProduct.name}`}
                            onClick={() => upsellItem()}
                        >
                            Erstat vare
                        </button>
                    </div>
                </td>
            </tr>
        );
    } else {
        return <></>;
    }
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
            <td className="product">
                <div className="picture">
                    <img className="picture" src={item.product!.imageUrl}></img>
                </div>
                <span className="product-info">
                    <p className="product-name">{`${item.product!.name}`}</p>
                    <span className="discount-container">
                        <p className="discount">
                            {item.product!.rebateQuantity > 0 &&
                                `Køb ${item.product!.rebateQuantity}, spar ${
                                    item.product!.rebatePercent
                                }%`}
                        </p>
                    </span>
                    <p
                        className="product-price"
                        aria-label={`Pris ${item.product!.price.toFixed(2)} ${
                            item.product!.currency
                        }`}
                    >{`${item.product!.price} ${item.product!.currency}`}</p>
                    <span className="input">
                        <div className="giftwrapping">
                            <label>
                                <p className="gift">Gave</p>
                                <input
                                    aria-label={`gavepapir ${item.product.name} ${item.giftWrap}`}
                                    type="checkbox"
                                    checked={item.giftWrap}
                                    onChange={() => toggleGiftWrap()}
                                />
                            </label>
                        </div>
                        <div className="reoccuringorder">
                            <label>
                                <p className="subscription">Abbonnér</p>
                                <input
                                    aria-label={`gentag order ${item.product.name} ${item.recurringOrder}`}
                                    type="checkbox"
                                    checked={item.recurringOrder}
                                    onChange={() =>
                                        toggleRecurringOrderSchedule()
                                    }
                                />
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
            <td className="price-total">{`${itemTotal().toFixed(2)} ${
                item.product!.currency
            }`}</td>
            <td className="trash">
                <button
                    className="trash-button"
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
