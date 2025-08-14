import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchProducts from '../hooks/useFetchProducts';
import styles from './WineCard.module.css';
import Search from '../components/Search';

const ProductPage = () => {
    const navigate = useNavigate();
    const { products, loading, error } = useFetchProducts();
    const [editing, setEditing] = useState(null);
    const [newPrice, setNewPrice] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    function handleSearchChange(value) {
        setSearchTerm(value);
    }

    const filteredProducts = products.filter((wine) => {
    const term = searchTerm.toLowerCase();

        return (
            wine.name.toLowerCase().includes(term) ||
            wine.type.toLowerCase().includes(term) ||
            wine.region.toLowerCase().includes(term) ||
            wine.year.toString().includes(term)
        );
    });

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

    const handleDelete = async (productId) => {
        const confirmed = window.confirm('Are you sure you want to delete this wine?');
        
        if (!confirmed) return;
        try {
            const response = await fetch(`http://localhost:6001/products/${productId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete product');
        
        window.location.reload(); // Simple reload for now
        } catch (error) {
        console.error('Error deleting product:', error);
        }
    };

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Wine List</h2>
            <Search searchTerm={searchTerm} onSearchChange={handleSearchChange} />

            {filteredProducts.length === 0 ? (
                <p>No results found for "{searchTerm}"</p>
            ) : (
                <ul>
                    {filteredProducts.map((wine) => (
                        <li key={wine.id} className={styles.wineCard}>
                        <h3 className={styles.wineName}>{wine.name} ({wine.year})</h3>
                        <p className={styles.wineDetails}><strong>Type:</strong> {wine.type}</p>
                        <p className={styles.wineDetails}><strong>Region:</strong> {wine.region}</p>
                        <p className={styles.wineDetails}><strong>Description:</strong> {wine.description}</p>
                        <p className={styles.price}><strong>Price:</strong> ${wine.price}</p>
                        <button onClick={() => navigate(`/edit-product/${wine.id}`)}>Edit</button>
                        <button onClick={() => handleDelete(wine.id)} style={{ marginLeft: '10px', color: 'red' }}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductPage
