import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import { AdminContext } from "../../contextStore/AdminContext";
import { collection, query, getDocs, orderBy, where, limit } from "firebase/firestore";
import { db } from "../../firebase/config";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const history = useHistory();
  const { admin, adminProfile, loading } = useContext(AdminContext);
  const [stats, setStats] = useState({
    totalSellers: 0,
    pendingVerifications: 0,
    totalProducts: 0,
    flaggedProducts: 0,
    totalUsers: 0,
    totalTransactions: 0,
    ecoImpact: {
      recycledItems: 0,
      co2Saved: 0,
      wasteDiverted: 0
    }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!admin) {
      history.push("/admin/login");
      return;
    }

    fetchDashboardData();
  }, [admin, history]);

  const fetchDashboardData = async () => {
    try {
      // Fetch sellers
      const sellersQuery = query(collection(db, "sellers"));
      const sellersSnapshot = await getDocs(sellersQuery);
      const sellers = sellersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Fetch products
      const productsQuery = query(collection(db, "products"));
      const productsSnapshot = await getDocs(productsQuery);
      const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Fetch users
      const usersQuery = query(collection(db, "users"));
      const usersSnapshot = await getDocs(usersQuery);
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate stats
      const pendingVerifications = sellers.filter(s => s.verificationStatus === 'pending').length;
      const flaggedProducts = products.filter(p => p.flagged === true).length;
      const recycledItems = products.filter(p => p.ecoRating >= 4).length;
      
      setStats({
        totalSellers: sellers.length,
        pendingVerifications,
        totalProducts: products.length,
        flaggedProducts,
        totalUsers: users.length,
        totalTransactions: 0, // This would come from transactions collection
        ecoImpact: {
          recycledItems,
          co2Saved: recycledItems * 50, // Estimated CO2 saved per item
          wasteDiverted: recycledItems * 2.5 // Estimated waste diverted in kg
        }
      });

      // Set recent activity (mock data for now)
      setRecentActivity([
        { type: 'verification', message: 'New seller verification submitted', time: '2 hours ago', status: 'pending' },
        { type: 'product', message: 'Product flagged for review', time: '4 hours ago', status: 'flagged' },
        { type: 'user', message: 'New user registered', time: '6 hours ago', status: 'success' },
        { type: 'transaction', message: 'High-value transaction completed', time: '8 hours ago', status: 'success' }
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-info">
          <h1>🌱 EcoFinds Admin Dashboard</h1>
          <p>Welcome back, {adminProfile?.fullName || admin.displayName}!</p>
        </div>
        <div className="admin-actions">
          <button 
            className="eco-button"
            onClick={() => history.push("/admin/sellers")}
          >
            Manage Sellers
          </button>
          <button 
            className="eco-button"
            onClick={() => history.push("/admin/products")}
          >
            Manage Products
          </button>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button 
          className={activeTab === "sellers" ? "active" : ""}
          onClick={() => setActiveTab("sellers")}
        >
          Sellers ({stats.pendingVerifications} pending)
        </button>
        <button 
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          Products ({stats.flaggedProducts} flagged)
        </button>
        <button 
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button 
          className={activeTab === "reports" ? "active" : ""}
          onClick={() => setActiveTab("reports")}
        >
          Eco Reports
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.totalSellers}</h3>
                  <p>Total Sellers</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-info">
                  <h3>{stats.pendingVerifications}</h3>
                  <p>Pending Verifications</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{stats.totalProducts}</h3>
                  <p>Total Products</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚠️</div>
                <div className="stat-info">
                  <h3>{stats.flaggedProducts}</h3>
                  <p>Flagged Products</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👤</div>
                <div className="stat-info">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>{stats.totalTransactions}</h3>
                  <p>Total Transactions</p>
                </div>
              </div>
            </div>

            <div className="eco-impact-section">
              <h3>🌱 Eco Impact Dashboard</h3>
              <div className="eco-stats-grid">
                <div className="eco-stat-card">
                  <div className="eco-stat-icon">♻️</div>
                  <div className="eco-stat-info">
                    <h3>{stats.ecoImpact.recycledItems}</h3>
                    <p>Items Recycled</p>
                  </div>
                </div>
                <div className="eco-stat-card">
                  <div className="eco-stat-icon">🌍</div>
                  <div className="eco-stat-info">
                    <h3>{stats.ecoImpact.co2Saved}kg</h3>
                    <p>CO2 Saved</p>
                  </div>
                </div>
                <div className="eco-stat-card">
                  <div className="eco-stat-icon">🗑️</div>
                  <div className="eco-stat-info">
                    <h3>{stats.ecoImpact.wasteDiverted}kg</h3>
                    <p>Waste Diverted</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'verification' && '📋'}
                      {activity.type === 'product' && '📦'}
                      {activity.type === 'user' && '👤'}
                      {activity.type === 'transaction' && '💰'}
                    </div>
                    <div className="activity-content">
                      <p>{activity.message}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                    <div className={`activity-status ${activity.status}`}>
                      {activity.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "sellers" && (
          <div className="sellers-tab">
            <h3>Seller Management</h3>
            <p>Manage seller verifications and accounts</p>
            <button 
              className="eco-button"
              onClick={() => history.push("/admin/sellers")}
            >
              View All Sellers
            </button>
          </div>
        )}

        {activeTab === "products" && (
          <div className="products-tab">
            <h3>Product Management</h3>
            <p>Review and manage product listings</p>
            <button 
              className="eco-button"
              onClick={() => history.push("/admin/products")}
            >
              View All Products
            </button>
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-tab">
            <h3>User Management</h3>
            <p>Monitor user activity and accounts</p>
            <button 
              className="eco-button"
              onClick={() => history.push("/admin/users")}
            >
              View All Users
            </button>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="reports-tab">
            <h3>Eco Impact Reports</h3>
            <p>Generate detailed reports on environmental impact</p>
            <button 
              className="eco-button"
              onClick={() => history.push("/admin/reports")}
            >
              Generate Reports
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
