import React, { useState } from 'react';
import { useProduct } from '../context/ProductContext';

const FormPage = () => {
  const { addProduct } = useProduct(); // Get the addProduct function from context
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [type, setType] = useState('');
  const [region, setRegion] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newProduct = {
      name: productName,
      price: Number(productPrice),
      type,
      region,
      year: Number(year),
      description
    };

    // Send POST request to add new product
    try {
      const response = await fetch('http://localhost:6001/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) throw new Error('Failed to add product');
      
      const addedProduct = await response.json();
      addProduct(addedProduct); // Add product to global state
      setProductName('');
      setProductPrice('');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div>
      <h2>Add a New Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
        <input type="number" placeholder="Price" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
        <input type="text" placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} />
        <input type="text" placeholder="Region" value={region} onChange={(e) => setRegion(e.target.value)} />
        <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit">Add Wine</button>
</form>
    </div>
  );
};

export default FormPage
