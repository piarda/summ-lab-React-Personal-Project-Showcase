import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { ProductProvider } from './context/ProductContext'; // Import the provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProductProvider> {/* Wrap the app with the provider */}
      <App />
    </ProductProvider>
  </React.StrictMode>
);
