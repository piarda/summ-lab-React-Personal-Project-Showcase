import React, { useState } from 'react';
import useFetchProducts from '../hooks/useFetchProducts';
import styles from './WineCard.module.css';

const ProductPage = () => {
  const { products, loading, error } = useFetchProducts();
  const [editing, setEditing] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  const handleEdit = (productId) => {
    setEditing(productId);
  };

  const handleSave = async (productId) => {
    // Send PATCH request to update product price
    try {
      const response = await fetch(`http://localhost:6001/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: newPrice }),
      });

      if (!response.ok) throw new Error('Failed to update product');

      const updatedProduct = await response.json();
      // Optionally, update the product list in the state or re-fetch products
      setEditing(null); // Close editing mode
      setNewPrice('');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

    return (
    <div>
        <h2>Wine List</h2>
        <ul>
        {products.map((wine) => (
            <li key={wine.id} className={styles.wineCard}>
                <h3 className={styles.wineName}>{wine.name} ({wine.year})</h3>
                <p className={styles.wineDetails}><strong>Type:</strong> {wine.type}</p>
                <p className={styles.wineDetails}><strong>Region:</strong> {wine.region}</p>
                <p className={styles.wineDetails}><strong>Description:</strong> {wine.description}</p>
                <p className={styles.price}><strong>Price:</strong> ${wine.price}</p>
        </li>
        ))}
        </ul>
        </div>
    );
};

export default ProductPage
