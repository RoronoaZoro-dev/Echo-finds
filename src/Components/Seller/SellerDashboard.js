import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import { SellerContext } from "../../contextStore/SellerContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import "./SellerDashboard.css";

export default function SellerDashboard() {
  const history = useHistory();
  const { seller, sellerProfile, loading } = useContext(SellerContext);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    pendingVerification: false
  });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!seller) {
      history.push("/seller/login");
      return;
    }

    fetchProducts();
  }, [seller, history]);

  const fetchProducts = async () => {
    try {
      const q = query(
        collection(db, "products"),
        where("sellerId", "==", seller.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
      setStats(prev => ({
        ...prev,
        totalProducts: productsList.length,
        pendingVerification: sellerProfile?.verificationStatus === 'pending'
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getVerificationStatus = () => {
    if (!sellerProfile) return { status: 'unknown', message: 'Loading...', color: '#gray' };
    
    switch (sellerProfile.verificationStatus) {
      case 'approved':
        return { status: 'approved', message: 'Verified Seller', color: '#4CAF50' };
      case 'pending':
        return { status: 'pending', message: 'Verification Pending', color: '#FF9800' };
      case 'rejected':
        return { status: 'rejected', message: 'Verification Rejected', color: '#F44336' };
      default:
        return { status: 'not-submitted', message: 'Not Verified', color: '#9E9E9E' };
    }
  };

  const verificationStatus = getVerificationStatus();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!seller) {
    return null;
  }

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <div className="seller-info">
          <h1>🌱 Welcome back, {sellerProfile?.businessName || seller.displayName}!</h1>
          <div className="verification-status">
            <span 
              className="status-indicator"
              style={{ backgroundColor: verificationStatus.color }}
            >
              {verificationStatus.message}
            </span>
          </div>
        </div>
        <div className="dashboard-actions">
          <button 
            className="eco-button"
            onClick={() => history.push("/seller/add-product")}
          >
            + Add New Product
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button 
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          My Products ({products.length})
        </button>
        <button 
          className={activeTab === "verification" ? "active" : ""}
          onClick={() => setActiveTab("verification")}
        >
          Verification
        </button>
        <button 
          className={activeTab === "analytics" ? "active" : ""}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{stats.totalProducts}</h3>
                  <p>Total Products</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>${stats.totalSales}</h3>
                  <p>Total Sales</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <h3>{sellerProfile?.rating || 0}</h3>
                  <p>Seller Rating</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🌱</div>
                <div className="stat-info">
                  <h3>{products.filter(p => p.ecoRating >= 4).length}</h3>
                  <p>Eco Products</p>
                </div>
              </div>
            </div>

            <div className="recent-products">
              <h3>Recent Products</h3>
              <div className="products-grid">
                {products.slice(0, 4).map(product => (
                  <div key={product.id} className="product-card">
                    <img src={product.images?.[0]} alt={product.name} />
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p className="price">${product.price}</p>
                      <div className="eco-rating">
                        <span>🌱</span>
                        <span>{product.ecoRating}/5</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="products-tab">
            <div className="products-header">
              <h3>My Products</h3>
              <button 
                className="eco-button"
                onClick={() => history.push("/seller/add-product")}
              >
                + Add Product
              </button>
            </div>
            <div className="products-list">
              {products.map(product => (
                <div key={product.id} className="product-item">
                  <img src={product.images?.[0]} alt={product.name} />
                  <div className="product-details">
                    <h4>{product.name}</h4>
                    <p>{product.description}</p>
                    <div className="product-meta">
                      <span className="price">${product.price}</span>
                      <span className="condition">{product.condition}</span>
                      <div className="eco-rating">
                        <span>🌱</span>
                        <span>{product.ecoRating}/5</span>
                      </div>
                    </div>
                  </div>
                  <div className="product-actions">
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "verification" && (
          <div className="verification-tab">
            <h3>Seller Verification</h3>
            <div className="verification-status-card">
              <div className="status-info">
                <h4>Verification Status: {verificationStatus.message}</h4>
                <p>Complete verification to build trust with buyers and unlock all features.</p>
              </div>
              {sellerProfile?.verificationStatus !== 'approved' && (
                <button 
                  className="eco-button"
                  onClick={() => history.push("/seller/verification")}
                >
                  {sellerProfile?.verificationStatus === 'pending' ? 'View Status' : 'Submit Documents'}
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="analytics-tab">
            <h3>Sales Analytics</h3>
            <div className="analytics-placeholder">
              <p>Analytics dashboard coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
