import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import FormPage from './pages/FormPage.jsx';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/product">Browse Wines</Link></li>
            <li><Link to="/add-product">Admin Portal</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/add-product" element={<FormPage />} />
          <Route path="/edit-product/:id" element={<FormPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
