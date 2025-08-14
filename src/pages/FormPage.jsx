import React, { useState, useEffect } from 'react';
import { useProduct } from '../context/ProductContext';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './FormPage.module.css';

const FormPage = () => {
  const { addProduct } = useProduct(); // Get the addProduct function from context
  const navigate = useNavigate();
  const { id } = useParams();

  // State variables for form inputs and UI feedback
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [type, setType] = useState('');
  const [region, setRegion] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // useEffect to fetch existing product data if an ID is present in the URL
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`http://localhost:6001/products/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch product');
          return res.json();
        })
        .then(data => {
          setProductName(data.name);
          setProductPrice(data.price);
          setType(data.type);
          setRegion(data.region);
          setYear(data.year);
          setDescription(data.description);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  // Handles form submission for both adding and editing
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Creates a product data object from the form state
    const productData = {
      name: productName,
      price: Number(productPrice),
      type,
      region,
      year: Number(year),
      description,
    };

    try {
      let response;

      if (id) {
        // EDIT mode: PATCH request
        response = await fetch(`http://localhost:6001/products/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      } else {
        // ADD mode: POST request
        response = await fetch('http://localhost:6001/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      }

      if (!response.ok) throw new Error('Failed to save product');

      const savedProduct = await response.json();

      if (!id) {
        // Only add new product to global state when adding
        addProduct(savedProduct);
      }

      // Show a success message and then redirect
      setSuccess(true);
      setTimeout(() => {
        navigate('/product');
      }, 2000);

    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  // Displays loading message while product data is being fetched
  if (loading) return <p>Loading product data...</p>;

  return (
    <div className={styles.formContainer}>
      <h2>{id ? 'Edit Wine' : 'Add a New Wine'}</h2>
      {success && <p style={{ color: 'green' }}>Wine {id ? 'updated' : 'added'} successfully!</p>}
      <form onSubmit={handleSubmit}>
        <input
          required
          type="text"
          placeholder="Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          required
          type="number"
          placeholder="Price"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
        />
        <input
          required
          type="text"
          placeholder="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <input
          required
          type="text"
          placeholder="Region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />
        <input
          required
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <textarea
          required
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">{id ? 'Save Changes' : 'Add Wine'}</button>
      </form>
    </div>
  );
};

export default FormPage
