import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import useFetchData from "../hooks/useFetchData";
import { CartItem } from "../interfaces/CartItem";
import { ProductItem } from "../interfaces/ProductItem";
import "./ProductList.css";

function ProductList({items, setItems}:{items:CartItem[], setItems:(values:CartItem[]) =>void})  {

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

    const {data, isLoading, error}=useFetchData<ProductItem[]>("https://raw.githubusercontent.com/larsthorup/checkout-data/main/product-v2.json",[])
    
    if(isLoading){ return( <h1> <BeatLoader size={34} color='#dc62ab' />  Produkter loader...</h1>) }
    else if(error != null) {return (<h1> {error} </h1>)}
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

                            <p className="button"><button onClick={()=> AddToItems(product)}><b><i>Læg i inkøbskurv</i></b></button></p>
                        </div>
                        
                    ) 
                )
            }

        </div>
     );
}
 
export default ProductList;