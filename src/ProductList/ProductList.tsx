import useFetchData from "../hooks/useFetch";
import { CartItem } from "../interfaces/CartItem";
import { ProductItem } from "../interfaces/ProductItem";
import { useEffect } from "react";
import {Products} from '../interfaces/Products';
import "./ProductList.css";
import RoundLoader from "../SpinnerAnimation/RounedLoader";

const dataUrl = "https://raw.githubusercontent.com/larsthorup/checkout-data/main/product-v2.json";

function ProductList({items, setItems, setList}:{items:CartItem[], setItems:(values:CartItem[]) => void, setList: (products:Products) => void})  {

    const {sendRequest,data, isLoading, error}=useFetchData<ProductItem[]>(dataUrl)

    const options: RequestInit = {
        method: "Get",
        headers: {'Content-Type': 'text/plain' },
    };    

    useEffect(() => {
        sendRequest(options)
    },[dataUrl]);

    useEffect(()=>{
        const products: Products = {};  

        data?.forEach((product) => {
            products[product.id] = product;
        })

        setList(products);
    },[data])

    const AddToItems= (product: ProductItem)=>{
        if(items.some((item)=>item.product.id === product.id)){
            setItems(
                items.map((item)=> 
                    item.product.id ===product.id ?{
                        ...item, 
                        quantity: item.quantity + 1
                    }:item
                )
            );
            return;
        }else{
            let item : CartItem= {
                product:product,
                quantity:1,
                giftWrap: false,
                recurringOrder:false
            }
            setItems([...items,item])
        }
        
    }
    
    if(isLoading){ return(<RoundLoader/>) }
    else if(error !== "") {return (<h1> {error} </h1>)}
    else return ( 
        <div className="ProductList">
            { data &&
                data.map(
                    (product)=> (
                        
                        <div className="card" aria-label={`Produkt ${product.name}`} key={product.id}>
                            <img src={product.imageUrl} alt={product.name}></img><br/>
                            <label className="name">{product.name}</label>                        
                            <p className="price">{`${product.price.toFixed(2)} ${product.currency}`}</p>

                            {((product.rebatePercent > 0) && (product.rebateQuantity > 0 )) 
                               ?( <p>Køb for {product.rebateQuantity} Stk (Spar<span className="rabat"> <i>{product.rebatePercent}%</i></span>)</p> )
                               :( <p> <br /></p>)                                    
                            }

                            <p className="add-button"><button onClick={()=> AddToItems(product)}><b><i>Læg i inkøbskurv</i></b></button></p>
                        </div>
                    ) 
                )
            }

        </div>
     );
}
 
export default ProductList;