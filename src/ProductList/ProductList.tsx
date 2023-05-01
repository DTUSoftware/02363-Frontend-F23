import useFetchData from "../hooks/useFetch";
import { CartItem } from "../interfaces/CartItem";
import { ProductItem } from "../interfaces/ProductItem";
import { useEffect } from "react";
import {Products} from '../interfaces/Products';
import "./ProductList.css";
import RoundLoader from "../SpinnerAnimation/RounedLoader";
import { ProductsContextType, ProductsContext } from "../context/ProductsContext";
import React from "react";
import { CartItemsContextType,CartItemsContext } from "../context/CartItemsContext";
import { useCartDispatch } from "../context/ShoppingContext";

const dataUrl = "https://raw.githubusercontent.com/larsthorup/checkout-data/main/product-v2.json";

function ProductList()  {

    
    const dispatch= useCartDispatch();
    const {setProductList}= React.useContext(ProductsContext) as ProductsContextType;
    const {sendRequest,data, isLoading, error}=useFetchData<ProductItem[]>(dataUrl)

    useEffect(() => {
        sendRequest();
    },[dataUrl]);

    useEffect(()=>{
        const products: Products = {};  

        data?.forEach((product) => {
            products[product.id] = product;
        })

        setProductList(products);
    },[data])

    const handleAddItem = (e: React.FormEvent, product: ProductItem | any) => {
        e.preventDefault();        
        dispatch({type:'addItem',payload:{product:product}})
    }; 

    
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

                            <p className="add-button"><button onClick={(e)=>handleAddItem(e,product)}><b><i>Læg i inkøbskurv</i></b></button></p>
                        </div>
                    ) 
                )
            }

        </div>
     );
}
 
export default ProductList;