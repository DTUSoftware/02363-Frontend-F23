import { useState } from "react";
import productsSJSON from "./assets/products.json";
import { FaRegTrashAlt } from "react-icons/fa";
import "./ShoppingList.css";

interface Item {
    id: String;
    name: String;
    price: number;
    currency: String;
    rebateQuantity: number;
    rebatePercent: number;
    upsellProductId: String | null;
}

type Products = { [key: string]: Item };

const products: Products = {};
productsSJSON.forEach((x) => (products[x.id] = x));

const itemList = [
    {
        product: products["vitamin-c-500-250"],
        quantity: 2,
        giftWrap: false,
    },
    { product: products["kids-songbook"], quantity: 1, giftWrap: true },
    {
        product: products["sugar-cane-1kg"],
        quantity: 2,
        giftWrap: false,
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

    function handleQuantityChange(product: Item, newQuantity: number) {
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

    const total = items.reduce(
        (sum, x) => (sum += x.quantity * x.product!.price),
        0
    );

    function recurringOrderSchedule() {
        //TODO: Not sure about this one
    }

    const listEmpty = items === undefined || items.length == 0;

    return (
        <div className="ShoppingList">
            <p className="heading">Din indkøbskurv</p>
            {!listEmpty ? (
                <div className="shopTable">
                    <table>
                        <thead>
                            <tr>
                                <th className="product">Produkt</th>
                                <th className="price">Pris</th>
                                <th> </th>
                                <th className="quantity">Antal</th>
                                <th> </th>
                                <th className="priceTotal">Total</th>
                                <th className="giftwrapping">Gavepapir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((x, index) => (
                                <tr key={index}>
                                    <td className="product">{`${x.product!.name}`}</td>
                                    <td className="price">{`${x.product!.price} ${
                                        x.product!.currency
                                    }`}</td>
                                    <td className="decrement">
                                        <button className="quantityBtn"
                                            onClick={() =>
                                                decrementQuantity(index)
                                            }
                                        >
                                            -
                                        </button>
                                    </td>
                                    <td className="quantity"> {x.quantity} </td>
                                    <td className="increment">
                                        <button className="quantityBtn"
                                            onClick={() =>
                                                incrementQuantity(index)
                                            }
                                        >
                                            +
                                        </button>
                                    </td>
                                    <td className="priceTotal">{`${x.quantity * x.product!.price} ${
                                        x.product!.currency
                                    }`}</td>
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
                                    <td>
                                        <button
                                            onClick={() => removeItem(index)}
                                        >
                                            <FaRegTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="total">{`Pris i alt ${total} ${items[0].product!.currency}`}</p>
                </div>
            ) : (
                <p>Din kurv er tom!</p>
            )}
        </div>
    );
}

export default ShoppingList;
