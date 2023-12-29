import React, { createContext, useState, useEffect } from "react";

// create context
export const ProductContext = createContext([]);

const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState([]); // Declare and initialize the 'products' state variable

  // fetch
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://fakestoreapi.com/products");
      const products = await response.json();
      setProducts(products);
    };
    fetchProducts();
  }, []);

  console.log(products);

  return <ProductContext.Provider value={products}>{children}</ProductContext.Provider>;
};

export default ProductProvider;