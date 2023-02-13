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


function ShoppingList() {
    const products = new Map<String,Item>();
    productsSJSON.map(x => products.set(x.id,x));
    console.log(products)

    const itemList = [
        { product: products.get("vitamin-c-500-250"), quantity: 2, giftWrap: false },
        { product: products.get("kids-songbook"), quantity: 1, giftWrap: true },
        { product: products.get("sugar-cane-1kg"), quantity: 2, giftWrap: false },
        ];

    const total = itemList.reduce((sum, x) => sum += x.quantity*x.product!.price, 0); 

    const listEmpty = itemList === undefined || itemList.length == 0;
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
                    </tr>
                </thead>
                <tbody>
                    {itemList.map((x,index) => (
                        <tr key={index}>
                            <th>{`${x.product!.name}`}</th>
                            <th>{`${x.product!.price} ${x.product!.currency}`}</th>
                            <th>{`${x.quantity}`}</th>
                            <th>{`${x.quantity*x.product!.price} ${x.product!.currency}`}</th>
                        </tr>
                    ))}
                </tbody>
            </table>
        <p>{`I alt ${total}`}</p>
      </div>
    ) : (
        <p>Kurven er tom!</p>
    ) }
    </div>
  )
}

export default ShoppingList;