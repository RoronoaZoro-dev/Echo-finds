import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import { AdminContext } from "../../contextStore/AdminContext";
import { collection, query, getDocs, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import "./EcoReports.css";

export default function EcoReports() {
  const history = useHistory();
  const { admin, adminProfile } = useContext(AdminContext);
  const [reportData, setReportData] = useState({
    totalProducts: 0,
    ecoFriendlyProducts: 0,
    recycledItems: 0,
    categories: {},
    monthlyTrends: [],
    topSellers: [],
    environmentalImpact: {
      co2Saved: 0,
      wasteDiverted: 0,
      energySaved: 0,
      waterSaved: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30"); // 7, 30, 90, 365
  const [selectedReport, setSelectedReport] = useState("overview");

  useEffect(() => {
    if (!admin) {
      history.push("/admin/login");
      return;
    }

    generateReport();
  }, [admin, history, dateRange]);

  const generateReport = async () => {
    try {
      setLoading(true);
      
      // Fetch all products
      const productsQuery = query(collection(db, "products"));
      const productsSnapshot = await getDocs(productsQuery);
      const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Fetch all sellers
      const sellersQuery = query(collection(db, "sellers"));
      const sellersSnapshot = await getDocs(sellersQuery);
      const sellers = sellersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate eco-friendly products
      const ecoFriendlyProducts = products.filter(p => p.ecoRating >= 4);
      const recycledItems = products.filter(p => p.ecoRating >= 3);
      
      // Calculate categories
      const categories = {};
      products.forEach(product => {
        categories[product.category] = (categories[product.category] || 0) + 1;
      });

      // Calculate environmental impact
      const environmentalImpact = {
        co2Saved: recycledItems.length * 50, // kg CO2 saved per item
        wasteDiverted: recycledItems.length * 2.5, // kg waste diverted
        energySaved: recycledItems.length * 100, // kWh energy saved
        waterSaved: recycledItems.length * 200 // liters water saved
      };

      // Calculate monthly trends (mock data for now)
      const monthlyTrends = [
        { month: 'Jan', products: 45, ecoProducts: 32, impact: 1200 },
        { month: 'Feb', products: 52, ecoProducts: 38, impact: 1400 },
        { month: 'Mar', products: 48, ecoProducts: 35, impact: 1300 },
        { month: 'Apr', products: 61, ecoProducts: 44, impact: 1600 },
        { month: 'May', products: 58, ecoProducts: 42, impact: 1550 },
        { month: 'Jun', products: 67, ecoProducts: 48, impact: 1700 }
      ];

      // Calculate top sellers by eco products
      const sellerStats = {};
      products.forEach(product => {
        if (!sellerStats[product.sellerId]) {
          sellerStats[product.sellerId] = {
            sellerId: product.sellerId,
            sellerName: product.sellerName,
            totalProducts: 0,
            ecoProducts: 0,
            totalImpact: 0
          };
        }
        sellerStats[product.sellerId].totalProducts++;
        if (product.ecoRating >= 4) {
          sellerStats[product.sellerId].ecoProducts++;
        }
        sellerStats[product.sellerId].totalImpact += product.ecoRating * 10;
      });

      const topSellers = Object.values(sellerStats)
        .sort((a, b) => b.ecoProducts - a.ecoProducts)
        .slice(0, 10);

      setReportData({
        totalProducts: products.length,
        ecoFriendlyProducts: ecoFriendlyProducts.length,
        recycledItems: recycledItems.length,
        categories,
        monthlyTrends,
        topSellers,
        environmentalImpact
      });
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ecofinds-report-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return <div className="admin-loading">Generating eco impact report...</div>;
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="eco-reports">
      <div className="reports-header">
        <h1>🌱 Eco Impact Reports</h1>
        <div className="report-controls">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="date-selector"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button className="export-btn" onClick={exportReport}>
            Export Report
          </button>
        </div>
      </div>

      <div className="report-tabs">
        <button 
          className={selectedReport === "overview" ? "active" : ""}
          onClick={() => setSelectedReport("overview")}
        >
          Overview
        </button>
        <button 
          className={selectedReport === "impact" ? "active" : ""}
          onClick={() => setSelectedReport("impact")}
        >
          Environmental Impact
        </button>
        <button 
          className={selectedReport === "trends" ? "active" : ""}
          onClick={() => setSelectedReport("trends")}
        >
          Trends
        </button>
        <button 
          className={selectedReport === "sellers" ? "active" : ""}
          onClick={() => setSelectedReport("sellers")}
        >
          Top Sellers
        </button>
      </div>

      <div className="report-content">
        {selectedReport === "overview" && (
          <div className="overview-report">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{reportData.totalProducts}</h3>
                  <p>Total Products</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🌱</div>
                <div className="stat-info">
                  <h3>{reportData.ecoFriendlyProducts}</h3>
                  <p>Eco-Friendly Products</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">♻️</div>
                <div className="stat-info">
                  <h3>{reportData.recycledItems}</h3>
                  <p>Recycled Items</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>{Math.round((reportData.ecoFriendlyProducts / reportData.totalProducts) * 100)}%</h3>
                  <p>Eco-Friendly Rate</p>
                </div>
              </div>
            </div>

            <div className="categories-breakdown">
              <h3>Products by Category</h3>
              <div className="categories-chart">
                {Object.entries(reportData.categories).map(([category, count]) => (
                  <div key={category} className="category-item">
                    <span className="category-name">{category}</span>
                    <div className="category-bar">
                      <div 
                        className="category-fill"
                        style={{ width: `${(count / reportData.totalProducts) * 100}%` }}
                      ></div>
                    </div>
                    <span className="category-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedReport === "impact" && (
          <div className="impact-report">
            <h3>Environmental Impact</h3>
            <div className="impact-grid">
              <div className="impact-card">
                <div className="impact-icon">🌍</div>
                <div className="impact-info">
                  <h3>{reportData.environmentalImpact.co2Saved} kg</h3>
                  <p>CO2 Emissions Saved</p>
                </div>
              </div>
              <div className="impact-card">
                <div className="impact-icon">🗑️</div>
                <div className="impact-info">
                  <h3>{reportData.environmentalImpact.wasteDiverted} kg</h3>
                  <p>Waste Diverted from Landfills</p>
                </div>
              </div>
              <div className="impact-card">
                <div className="impact-icon">⚡</div>
                <div className="impact-info">
                  <h3>{reportData.environmentalImpact.energySaved} kWh</h3>
                  <p>Energy Saved</p>
                </div>
              </div>
              <div className="impact-card">
                <div className="impact-icon">💧</div>
                <div className="impact-info">
                  <h3>{reportData.environmentalImpact.waterSaved} L</h3>
                  <p>Water Saved</p>
                </div>
              </div>
            </div>

            <div className="impact-summary">
              <h4>Impact Summary</h4>
              <p>
                Through our marketplace, we've helped divert {reportData.environmentalImpact.wasteDiverted} kg of waste 
                from landfills and saved approximately {reportData.environmentalImpact.co2Saved} kg of CO2 emissions. 
                This is equivalent to planting {Math.round(reportData.environmentalImpact.co2Saved / 22)} trees!
              </p>
            </div>
          </div>
        )}

        {selectedReport === "trends" && (
          <div className="trends-report">
            <h3>Monthly Trends</h3>
            <div className="trends-chart">
              {reportData.monthlyTrends.map((trend, index) => (
                <div key={index} className="trend-item">
                  <div className="trend-month">{trend.month}</div>
                  <div className="trend-bars">
                    <div className="trend-bar">
                      <div className="bar-label">Total Products</div>
                      <div className="bar-fill" style={{ width: `${(trend.products / 70) * 100}%` }}></div>
                      <div className="bar-value">{trend.products}</div>
                    </div>
                    <div className="trend-bar">
                      <div className="bar-label">Eco Products</div>
                      <div className="bar-fill eco" style={{ width: `${(trend.ecoProducts / 50) * 100}%` }}></div>
                      <div className="bar-value">{trend.ecoProducts}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedReport === "sellers" && (
          <div className="sellers-report">
            <h3>Top Eco-Friendly Sellers</h3>
            <div className="sellers-list">
              {reportData.topSellers.map((seller, index) => (
                <div key={seller.sellerId} className="seller-item">
                  <div className="seller-rank">#{index + 1}</div>
                  <div className="seller-info">
                    <h4>{seller.sellerName}</h4>
                    <p>{seller.ecoProducts} eco-friendly products</p>
                  </div>
                  <div className="seller-stats">
                    <div className="stat">
                      <span className="stat-value">{seller.totalProducts}</span>
                      <span className="stat-label">Total Products</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{Math.round((seller.ecoProducts / seller.totalProducts) * 100)}%</span>
                      <span className="stat-label">Eco Rate</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
