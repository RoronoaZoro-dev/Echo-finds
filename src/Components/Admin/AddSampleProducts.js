import React, { useState } from 'react';
import { addSampleProducts } from '../../utils/addSampleProducts';
import './AddSampleProducts.css';

export default function AddSampleProducts() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddSampleProducts = async () => {
    setLoading(true);
    setMessage('');
    
    const result = await addSampleProducts();
    
    if (result.success) {
      setMessage('✅ Sample products added successfully! Refresh the page to see them.');
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="add-sample-products">
      <div className="sample-products-container">
        <h2>🌱 Add Sample Products</h2>
        <p>This will add sample eco-friendly products to your database for testing purposes.</p>
        
        <button 
          className="eco-button"
          onClick={handleAddSampleProducts}
          disabled={loading}
        >
          {loading ? 'Adding Products...' : 'Add Sample Products'}
        </button>
        
        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        
        <div className="sample-products-info">
          <h3>🌱 Eco-Friendly Products Include:</h3>
          <div className="categories-grid">
            <div className="category-section">
              <h4>🏠 Furniture & Home</h4>
              <ul>
                <li>Vintage Wooden Chair</li>
                <li>Reclaimed Wood Coffee Table</li>
                <li>Bamboo Bookshelf</li>
              </ul>
            </div>
            <div className="category-section">
              <h4>👕 Clothing & Fashion</h4>
              <ul>
                <li>Organic Cotton T-Shirt</li>
                <li>Vintage Denim Jacket</li>
                <li>Hemp Backpack</li>
                <li>Upcycled Sweater</li>
              </ul>
            </div>
            <div className="category-section">
              <h4>📱 Electronics & Tech</h4>
              <ul>
                <li>Refurbished Laptop</li>
                <li>Solar Phone Charger</li>
                <li>Refurbished Smartphone</li>
              </ul>
            </div>
            <div className="category-section">
              <h4>🏡 Home & Garden</h4>
              <ul>
                <li>Handmade Ceramic Vase</li>
                <li>Indoor Herb Garden Kit</li>
                <li>Cork Bulletin Board</li>
                <li>Bamboo Plant Pots Set</li>
              </ul>
            </div>
            <div className="category-section">
              <h4>📚 Books & Media</h4>
              <ul>
                <li>Educational Books Set</li>
                <li>Zero Waste Living Guide</li>
              </ul>
            </div>
            <div className="category-section">
              <h4>🏃 Sports & Recreation</h4>
              <ul>
                <li>Bamboo Yoga Mat</li>
                <li>Recycled Plastic Water Bottle</li>
                <li>Organic Cotton Gym Towel</li>
              </ul>
            </div>
            <div className="category-section">
              <h4>💄 Beauty & Personal Care</h4>
              <ul>
                <li>Natural Soap Set</li>
                <li>Bamboo Toothbrush Set</li>
              </ul>
            </div>
            <div className="category-section">
              <h4>🍽️ Kitchen & Dining</h4>
              <ul>
                <li>Beeswax Food Wraps Set</li>
                <li>Stainless Steel Straws Set</li>
                <li>Bamboo Cutlery Set</li>
              </ul>
            </div>
            <div className="category-section">
              <h4>👶 Kids & Baby</h4>
              <ul>
                <li>Organic Cotton Baby Onesies</li>
                <li>Wooden Building Blocks</li>
              </ul>
            </div>
            <div className="category-section">
              <h4>🐕 Pet Supplies</h4>
              <ul>
                <li>Hemp Dog Collar</li>
                <li>Bamboo Pet Bowl Set</li>
              </ul>
            </div>
          </div>
          <p className="total-products">✨ Total: 28 eco-friendly products across 10 categories</p>
        </div>
      </div>
    </div>
  );
}
