import { useState } from 'react';
import productsSJSON from './assets/products.json'

interface Item {
    id: String,
    name: String,
    price: number,
    currency: String,
    rebateQuantity: number,
    rebatePercent: number,
    upsellProductId: String | null
  }

const products = new Map<String,Item>();
productsSJSON.map(x => products.set(x.id,x));
console.log(products)

const itemList = [
    { product: products.get("vitamin-c-500-250"), quantity: 2, giftWrap: false },
    { product: products.get("kids-songbook"), quantity: 1, giftWrap: true },
    { product: products.get("sugar-cane-1kg"), quantity: 2, giftWrap: false },
    ];

function ShoppingList() {
    function changeQuantity(index: number) {
        //TODO: Could be implemented as clickable + or - buttons that increment or decrement quantity of a specific item
    }

    function removeItem(index: number) {
        //TODO: Remove item from itemList, perhaps using its index 
        setItems(items.filter((p,i) => i != index))
    }

    function recurringOrderSchedule() {
        //TODO: Not sure about this one
    }

    const [items , setItems ]= useState(itemList)
   
    const total = items.reduce((sum, x) => sum += x.quantity*x.product!.price, 0); 

    const listEmpty = items === undefined || items.length == 0;

  return (
    <div className="ShoppingList">
        <p>Kurv</p>
        {!listEmpty ? (
        <div className='shopTable'>
            <table>
                <thead>
                    <tr>
                        <th>Navn</th>
                        <th>Pris</th>
                        <th>Stk</th>
                        <th>Beløb</th>
                        <th>Gavepapir</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((x,index) => (
                        <tr key={index}>
                            <th>{`${x.product!.name}`}</th>
                            <th>{`${x.product!.price} ${x.product!.currency}`}</th>
                            <th>{`${x.quantity}`}</th>
                            <th>{`${x.quantity*x.product!.price} ${x.product!.currency}`}</th>
                            <th>{`${x.giftWrap}`}</th>
                            <th><button onClick={ ()=> removeItem(index)}>Delete</button></th>
                        </tr>
                    ))}
                </tbody>
            </table>
        <p>{`I alt ${total} ${items[0].product!.currency}`}</p>
      </div>
    ) : (
        <p>Kurven er tom!</p>
    ) }
    </div>
  )
}

export default ShoppingList;