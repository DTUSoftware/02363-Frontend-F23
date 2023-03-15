import { useNavigate } from "react-router-dom";
import useFetchData from "../hooks/useFetchData";
import { CartItem } from "../interfaces/CartItem";
import { ProductItem } from "../interfaces/ProductItem";
import "./ProductList.css";

function ProductList({basket, setBasket}:{basket:CartItem[], setBasket:(values:CartItem[]) =>void})  {

    const AddToBasket= (product: ProductItem)=>{
        if(basket.some((item)=>item.product.id === product.id)){
            setBasket(
                basket.map((item)=> 
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
            setBasket([...basket,item])
        }
        
    }

    const {data, isLoading, error}=useFetchData<ProductItem[]>("https://raw.githubusercontent.com/larsthorup/checkout-data/main/product-v2.json",[])
    
    if(isLoading) return( <h1>loading....</h1> )
    else if(error != null) return( <h1>{error}</h1> )
    else return ( 
        <div className="ProductList">
            { data &&
                data.map(
                    (product)=> (
                        
                        <div className="card" key={product.id}>
                            <img src={product.imageUrl} alt={product.name} width="250" height="250" ></img>
                            <h3 className="name">{product.name}</h3>                        
                            <p className="price">{product.price},00 {product.currency}</p>

                            {((product.rebatePercent > 0) && (product.rebateQuantity > 0 )) 
                               ?( <p>Køb for {product.rebateQuantity} Stk (Spar<span className="rabat"> <i>{product.rebatePercent}%</i></span> )</p> )
                               :(<p> <br /></p>)                                    
                            }

                            <p className="button"><button onClick={()=> AddToBasket(product)}><b><i>Læg i inkøbskurv</i></b></button></p>
                        </div>
                        
                    ) 
                )
            }

        </div>
     );
}
 
export default ProductList;