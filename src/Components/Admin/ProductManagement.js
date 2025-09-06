import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import { AdminContext } from "../../contextStore/AdminContext";
import { collection, query, getDocs, doc, updateDoc, orderBy, where } from "firebase/firestore";
import { db } from "../../firebase/config";
import "./ProductManagement.css";

export default function ProductManagement() {
  const history = useHistory();
  const { admin, adminProfile } = useContext(AdminContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, active, flagged, pending
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (!admin) {
      history.push("/admin/login");
      return;
    }

    fetchProducts();
  }, [admin, history]);

  const fetchProducts = async () => {
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProductStatus = async (productId, status, reason = "") => {
    try {
      await updateDoc(doc(db, "products", productId), {
        status: status,
        adminNotes: reason,
        reviewedAt: new Date().toISOString(),
        reviewedBy: admin.uid
      });
      
      // Update local state
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, status: status, adminNotes: reason }
          : product
      ));
      
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const flagProduct = async (productId, reason) => {
    try {
      await updateDoc(doc(db, "products", productId), {
        flagged: true,
        flagReason: reason,
        flaggedAt: new Date().toISOString(),
        flaggedBy: admin.uid
      });
      
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, flagged: true, flagReason: reason }
          : product
      ));
    } catch (error) {
      console.error("Error flagging product:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'flagged': return '#F44336';
      case 'suspended': return '#9E9E9E';
      default: return '#2196F3';
    }
  };

  const filteredProducts = products.filter(product => {
    if (filter === "all") return true;
    if (filter === "flagged") return product.flagged === true;
    return product.status === filter;
  });

  if (loading) {
    return <div className="admin-loading">Loading products...</div>;
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="product-management">
      <div className="management-header">
        <h1>🌱 Product Management</h1>
        <div className="filter-tabs">
          <button 
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All ({products.length})
          </button>
          <button 
            className={filter === "active" ? "active" : ""}
            onClick={() => setFilter("active")}
          >
            Active ({products.filter(p => p.status === 'active').length})
          </button>
          <button 
            className={filter === "flagged" ? "active" : ""}
            onClick={() => setFilter("flagged")}
          >
            Flagged ({products.filter(p => p.flagged === true).length})
          </button>
          <button 
            className={filter === "pending" ? "active" : ""}
            onClick={() => setFilter("pending")}
          >
            Pending ({products.filter(p => p.status === 'pending').length})
          </button>
        </div>
      </div>

      <div className="products-list">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.images?.[0]} alt={product.name} />
            </div>
            
            <div className="product-info">
              <div className="product-basic">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-meta">
                  <span className="price">${product.price}</span>
                  <span className="category">{product.category}</span>
                  <span className="condition">{product.condition}</span>
                  <div className="eco-rating">
                    <span>🌱</span>
                    <span>{product.ecoRating}/5</span>
                  </div>
                </div>
              </div>
              
              <div className="product-details">
                <p><strong>Seller:</strong> {product.sellerName}</p>
                <p><strong>Materials:</strong> {product.materials || 'Not specified'}</p>
                <p><strong>Created:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
                {product.flagged && (
                  <p className="flag-reason"><strong>Flagged:</strong> {product.flagReason}</p>
                )}
              </div>
            </div>

            <div className="product-status">
              <div 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(product.status) }}
              >
                {product.status.toUpperCase()}
              </div>
              {product.flagged && (
                <div className="flagged-badge">FLAGGED</div>
              )}
            </div>

            <div className="product-actions">
              <button 
                className="view-btn"
                onClick={() => setSelectedProduct(product)}
              >
                View Details
              </button>
              
              {product.status === 'active' && (
                <button 
                  className="flag-btn"
                  onClick={() => {
                    const reason = prompt("Reason for flagging:");
                    if (reason) flagProduct(product.id, reason);
                  }}
                >
                  Flag
                </button>
              )}
              
              {product.flagged && (
                <button 
                  className="unflag-btn"
                  onClick={() => updateProductStatus(product.id, 'active')}
                >
                  Unflag
                </button>
              )}
              
              <button 
                className="suspend-btn"
                onClick={() => {
                  const reason = prompt("Reason for suspension:");
                  if (reason) updateProductStatus(product.id, 'suspended', reason);
                }}
              >
                Suspend
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="product-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedProduct.name}</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedProduct(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="product-images">
                {selectedProduct.images?.map((image, index) => (
                  <img key={index} src={image} alt={`${selectedProduct.name} ${index + 1}`} />
                ))}
              </div>
              
              <div className="product-details-full">
                <h4>Product Information</h4>
                <p><strong>Description:</strong> {selectedProduct.description}</p>
                <p><strong>Price:</strong> ${selectedProduct.price}</p>
                <p><strong>Category:</strong> {selectedProduct.category}</p>
                <p><strong>Condition:</strong> {selectedProduct.condition}</p>
                <p><strong>Eco Rating:</strong> {selectedProduct.ecoRating}/5</p>
                <p><strong>Materials:</strong> {selectedProduct.materials || 'Not specified'}</p>
                <p><strong>Sustainability:</strong> {selectedProduct.sustainability || 'Not specified'}</p>
                
                <h4>Seller Information</h4>
                <p><strong>Seller:</strong> {selectedProduct.sellerName}</p>
                <p><strong>Seller ID:</strong> {selectedProduct.sellerId}</p>
                
                <h4>Admin Information</h4>
                {selectedProduct.adminNotes && (
                  <p><strong>Admin Notes:</strong> {selectedProduct.adminNotes}</p>
                )}
                {selectedProduct.flagReason && (
                  <p><strong>Flag Reason:</strong> {selectedProduct.flagReason}</p>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="approve-btn"
                onClick={() => {
                  updateProductStatus(selectedProduct.id, 'active');
                  setSelectedProduct(null);
                }}
              >
                Approve
              </button>
              <button 
                className="flag-btn"
                onClick={() => {
                  const reason = prompt("Reason for flagging:");
                  if (reason) {
                    flagProduct(selectedProduct.id, reason);
                    setSelectedProduct(null);
                  }
                }}
              >
                Flag
              </button>
              <button 
                className="suspend-btn"
                onClick={() => {
                  const reason = prompt("Reason for suspension:");
                  if (reason) {
                    updateProductStatus(selectedProduct.id, 'suspended', reason);
                    setSelectedProduct(null);
                  }
                }}
              >
                Suspend
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
