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

const products = new Map<String, Item>();
productsSJSON.map((x) => products.set(x.id, x));
console.log(products);

const itemList = [
    {
        product: products.get("vitamin-c-500-250"),
        quantity: 2,
        giftWrap: false,
    },
    { product: products.get("kids-songbook"), quantity: 1, giftWrap: true },
    {
        product: products.get("sugar-cane-1kg"),
        quantity: 2,
        giftWrap: false,
    },
];

function ShoppingList() {
    const [items, setItems] = useState(itemList);

    function incrementQuantity(index: number) {
        if (items.at(index)?.product) {
            var quanitity = items.at(index)!.quantity + 1;
            console.log(
                "New quantity of:" +
                    items.at(index)!.product?.name +
                    " is:" +
                    quanitity
            );
            handleQuantityChange(items.at(index)!.product!, quanitity);
        } else {
            console.log("No change in quanitity!");
        }
    }
    function decrementQuantity(index: number) {
        if (items.at(index)?.product && items.at(index)!.quantity >= 1) {
            var quanitity = items.at(index)!.quantity - 1;
            console.log("New quantity is: " + quanitity);
            handleQuantityChange(items.at(index)!.product!, quanitity);
        } else {
            console.log("No change in quanitity!");
        }
    }

    function removeItem(index: number) {
        setItems(items.filter((p, i) => i != index));
    }

    function recurringOrderSchedule() {
        //TODO: Not sure about this one
    }

    const total = items.reduce(
        (sum, x) => (sum += x.quantity * x.product!.price),
        0
    );

    const listEmpty = items === undefined || items.length == 0;

    function handleQuantityChange(product: Item, newQuantity: number) {
        //based on https://beta.reactjs.org/learn/updating-objects-in-state
        const newItemList = [...items];
        const item = newItemList.find((i) => i.product === product);
        item!.quantity = newQuantity;
        setItems(newItemList);
    }

    return (
        <div className="ShoppingList">
            <p className="qpr">Din indkøbskurv</p>
            {!listEmpty ? (
                <div className="shopTable">
                    <table>
                        <thead>
                            <tr>
                                <th>Produkt</th>
                                <th>Pris</th>
                                <th>Antal</th>
                                <th>Beløb</th>
                                <th>Gavepapir</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((x, index) => (
                                <tr key={index}>
                                    <td>{`${x.product!.name}`}</td>
                                    <td>{`${x.product!.price} ${
                                        x.product!.currency
                                    }`}</td>
                                    <td> {x.quantity} </td>
                                    <td>{`${x.quantity * x.product!.price} ${
                                        x.product!.currency
                                    }`}</td>
                                    <td>{`${x.giftWrap}`}</td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                incrementQuantity(index)
                                            }
                                        >
                                            +
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                decrementQuantity(index)
                                            }
                                        >
                                            -
                                        </button>
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
                    <p>{`Pris i alt ${total} ${items[0].product!.currency}`}</p>
                </div>
            ) : (
                <p>Din kurv er tom!</p>
            )}
        </div>
    );
}

export default ShoppingList;
