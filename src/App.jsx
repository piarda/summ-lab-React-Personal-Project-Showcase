import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
            <li><a href="/">Home</a></li>
            <li><a href="/product">Wines</a></li>
            <li><a href="/add-product">Add Wine</a></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/add-product" element={<FormPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
