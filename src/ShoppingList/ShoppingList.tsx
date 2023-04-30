import { useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import "./ShoppingList.css";
import { CartItem } from "../interfaces/CartItem";
import { Products } from "../interfaces/Products";
import { ProductItem } from "../interfaces/ProductItem";
import { routes } from "../Navigation/RoutePaths";
import navigate from "../Navigation/navigate";

/**
 * ShoppingList component page where the user can adjust their cart items and see pricings
 */
function ShoppingList({
    items,
    setItems,
    productList
}: {
    items: CartItem[];
    setItems: (items: CartItem[]) => void;
    productList: Products;
}) {

    // useEffect that populates the cart with dummy items if it is empty
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

    // Function for incrementing product item quantity
    function incrementQuantity(index: number) {
        const item = items.at(index);
        if (item !== undefined) {
            handleQuantityChange(item.product, item.quantity + 1);
        }
    }

    // Function for decrementing product item quantity
    function decrementQuantity(index: number) {
        const item = items.at(index);
        if (item !== undefined && item.quantity > 1) {
            handleQuantityChange(item.product, item.quantity - 1);
        }
    }

    // Function to set upsell item
    function upsellItem(index: number) {
        const item = items.at(index);
        if (item !== undefined && item.product.upsellProductId !== null) {
            const upsell = `${item.product.upsellProductId}`;
            handleUpsellChange(item.product, upsell);
        }
    }

    // Function to remove an item
    function removeItem(index: number) {
        setItems(items.filter((p, i) => i !== index));
    }

    // Function to toggle giftwrap on an item
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

    // Function to handle quantity change for a productItem
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

    // Function to handle upsell change by replacing a productItem with its upsell product
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

    // Function to toggle recurring order schedule on an item
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

    // Checks if the items list is empty
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
                    productList={productList}
                />
            ) : (
                <p className="emptyshoplist">Din kurv er tom!</p>
            )}
        </div>
    );
}

/**
 * ProductTable component which displays the whole shopping list page if the cartItems list is not empty
 */
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

    // Function for getting the cartItem total price
    const itemTotal = (item: CartItem) => {
        const priceSum = item.quantity * item.product.price;
        if (item.quantity >= item.product.rebateQuantity) {
            return priceSum * (1 - item.product.rebatePercent / 100);
        } else {
            return priceSum;
        }
    };

    // Function to determine if any cartItem in the items list has upsell products
    const hasUpsellProducts = () => {
        let upsellItemsExsist = false;
        items.forEach((item) => {
            if (item.product.upsellProductId !== null) {
                upsellItemsExsist = true;
            }
        });
        return upsellItemsExsist;
    };

    // onClick function which navigates the user to the delivery routePath
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
            {hasUpsellProducts() && 
            <div>
            <h1 className="delivery-heading">
                            Varer som andre kunder har set på
                        </h1>
                <div className="upsell-table">
                    <table>
                        <tbody>
                            <tr>
                            {items.map((item, index) => (
                                <UpsellItems
                                    key={index}
                                    item={item}
                                    upsellItem={() => upsellItem(index)}
                                    productList={productList}
                                />
                            ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            }
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

/**
 * CartTotal component which displays the item list total pricings
 */
function CartTotal({
    items,
    itemTotal,
}: {
    items: CartItem[];
    itemTotal: (item: CartItem) => number;
}) {

    // Defined pricing constants
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
    const total = (
        cartTotal +
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
                    hasRebate ? totalWithRebate : total
                } ${currency}`}
            >
                {`${
                    hasRebate ? totalWithRebate : total
                } ${currency}`}
            </span>
        </p>
    );
}

/**
 * UpsellItems component which displays a single upsell item for a particular CartItem, if it has any
 */
function UpsellItems({
    item,
    upsellItem,
    productList,
}: {
    item: CartItem;
    upsellItem: () => void;
    productList: Products;
}) {

    // holds the upsell item of a CartItem if it has any, else null 
    const upsellProduct =
        item.product.upsellProductId !== null
            ? productList[item.product.upsellProductId]
            : null;

    if (upsellProduct !== null) {
        return (
            <td>
                <div className="upsell-content">
                    <img
                        className="upsell-picture"
                        alt={`Billede af ${upsellProduct.name}`}
                        src={upsellProduct.imageUrl}
                    />
                    <p className="upsell-product-name">{upsellProduct.name}</p>
                    <button
                        className="upsellBtn"
                        aria-label={`Andre har valgt ${upsellProduct.name}`}
                        onClick={() => upsellItem()}
                    >
                        Erstat vare
                    </button>
                </div>
            </td>
        );
    } else {
        return <></>;
    }
}

/**
 * ProductTableRow component which displays a single cartItems row in the users shopping list
 */
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
