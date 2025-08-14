import React, { createContext, useContext, useState } from 'react';

// Create the context
const ProductContext = createContext();

// Provider component
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Function to add a product
  const addProduct = (product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use the context
export const useProduct = () => useContext(ProductContext);
