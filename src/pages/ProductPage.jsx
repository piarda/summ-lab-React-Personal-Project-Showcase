import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetchProducts from '../hooks/useFetchProducts';
import styles from './WineCard.module.css';
import Search from '../components/Search';

const ProductPage = () => {
    const navigate = useNavigate();
    const { products, setProducts, loading, error } = useFetchProducts();
    const [searchTerm, setSearchTerm] = useState('');
    
    // Handler to update the search term state
    function handleSearchChange(value) {
        setSearchTerm(value);
    }

    // Filters products based on the search term
    const filteredProducts = products.filter((wine) => {
    const term = searchTerm.toLowerCase();

        return (
            wine.name.toLowerCase().includes(term) ||
            wine.type.toLowerCase().includes(term) ||
            wine.region.toLowerCase().includes(term) ||
            wine.year.toString().includes(term)
        );
    });

    // Sorts the filtered products alphabetically by name
    const sortedFilteredProducts = [...filteredProducts].sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    // Handles the deletion of a product
    const handleDelete = async (productId) => {
        const confirmed = window.confirm('Are you sure you want to delete this wine?'); // Confirms before deleting
        if (!confirmed) return;

        try {
            const response = await fetch(`http://localhost:6001/products/${productId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete product');
        
        // Updates the UI by removing the deleted wine from the state
        setProducts(prev => prev.filter(wine => wine.id !== productId));
    } catch (error) {
        console.error('Error deleting product:', error);
    }
    };

    // Renders a loading or an error message based on state
    if (loading) return <p>Loading products...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Wine List</h2>
            <div className="searchContainer">
                <Search searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            </div>

            {filteredProducts.length === 0 ? (
                <p>No results found for "{searchTerm}"</p>
            ) : (
                <ul className={styles.wineGrid}>
                    {sortedFilteredProducts.map((wine) => (
                        <li key={wine.id} className={styles.wineCard}>
                        <h3 className={styles.wineName}>{wine.name} ({wine.year})</h3>
                        <p className={styles.wineDetails}><strong>Type:</strong> {wine.type}</p>
                        <p className={styles.wineDetails}><strong>Region:</strong> {wine.region}</p>
                        <p className={styles.wineDetails}><strong>Description:</strong> {wine.description}</p>
                        <p className={styles.price}><strong>Price:</strong> ${wine.price}</p>
                        <div className={styles.buttonGroup}>
                            <button className={styles.button} onClick={() => navigate(`/edit-product/${wine.id}`)}>Edit</button>
                            <button className={`${styles.button} ${styles.deleteButton}`} onClick={() => handleDelete(wine.id)} >Delete</button>
                        </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductPage
