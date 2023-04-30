import { useState } from "react";
import { Products } from "../interfaces/Products";
import React from "react";

export type ProductsContextType = {
    productList: Products;
    setProductList:(data:Products) => void;
};


interface Props {
    children: React.ReactNode;
}

//ProductsContext
export const ProductsContext = React.createContext<ProductsContextType | null>(null);


const ProductsProvider: React.FC<Props> = ({ children }): any => {
    const [productList, setProductList] = useState<Products>({});

    return (
        <ProductsContext.Provider value={{ productList, setProductList}}>
            {children}
        </ProductsContext.Provider>
    );

}

export default ProductsProvider;