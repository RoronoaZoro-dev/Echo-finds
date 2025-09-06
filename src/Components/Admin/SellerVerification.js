import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router";
import { AdminContext } from "../../contextStore/AdminContext";
import { collection, query, getDocs, doc, updateDoc, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import "./SellerVerification.css";

export default function SellerVerification() {
  const history = useHistory();
  const { admin, adminProfile } = useContext(AdminContext);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, approved, rejected
  const [selectedSeller, setSelectedSeller] = useState(null);

  useEffect(() => {
    if (!admin) {
      history.push("/admin/login");
      return;
    }

    fetchSellers();
  }, [admin, history]);

  const fetchSellers = async () => {
    try {
      const q = query(collection(db, "sellers"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const sellersList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSellers(sellersList);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateVerificationStatus = async (sellerId, status, notes = "") => {
    try {
      await updateDoc(doc(db, "sellers", sellerId), {
        verificationStatus: status,
        verificationNotes: notes,
        verifiedAt: new Date().toISOString(),
        verifiedBy: admin.uid
      });
      
      // Update local state
      setSellers(prev => prev.map(seller => 
        seller.id === sellerId 
          ? { ...seller, verificationStatus: status, verificationNotes: notes }
          : seller
      ));
      
      setSelectedSeller(null);
    } catch (error) {
      console.error("Error updating verification status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'rejected': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const filteredSellers = sellers.filter(seller => {
    if (filter === "all") return true;
    return seller.verificationStatus === filter;
  });

  if (loading) {
    return <div className="admin-loading">Loading sellers...</div>;
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="seller-verification">
      <div className="verification-header">
        <h1>🌱 Seller Verification Management</h1>
        <div className="filter-tabs">
          <button 
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All ({sellers.length})
          </button>
          <button 
            className={filter === "pending" ? "active" : ""}
            onClick={() => setFilter("pending")}
          >
            Pending ({sellers.filter(s => s.verificationStatus === 'pending').length})
          </button>
          <button 
            className={filter === "approved" ? "active" : ""}
            onClick={() => setFilter("approved")}
          >
            Approved ({sellers.filter(s => s.verificationStatus === 'approved').length})
          </button>
          <button 
            className={filter === "rejected" ? "active" : ""}
            onClick={() => setFilter("rejected")}
          >
            Rejected ({sellers.filter(s => s.verificationStatus === 'rejected').length})
          </button>
        </div>
      </div>

      <div className="sellers-list">
        {filteredSellers.map(seller => (
          <div key={seller.id} className="seller-card">
            <div className="seller-info">
              <div className="seller-basic">
                <h3>{seller.businessName}</h3>
                <p>{seller.fullName}</p>
                <p className="seller-email">{seller.email}</p>
                <p className="seller-phone">{seller.phone}</p>
              </div>
              <div className="seller-details">
                <p><strong>Business Type:</strong> {seller.businessType}</p>
                <p><strong>Address:</strong> {seller.address}</p>
                {seller.ecoCertification && (
                  <p><strong>Eco Certification:</strong> {seller.ecoCertification}</p>
                )}
                <p><strong>Joined:</strong> {new Date(seller.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="verification-status">
              <div 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(seller.verificationStatus) }}
              >
                {seller.verificationStatus.toUpperCase()}
              </div>
              {seller.verificationDocuments && seller.verificationDocuments.length > 0 && (
                <button 
                  className="view-docs-btn"
                  onClick={() => setSelectedSeller(seller)}
                >
                  View Documents
                </button>
              )}
            </div>

            <div className="seller-actions">
              {seller.verificationStatus === 'pending' && (
                <>
                  <button 
                    className="approve-btn"
                    onClick={() => updateVerificationStatus(seller.id, 'approved')}
                  >
                    Approve
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => {
                      const notes = prompt("Reason for rejection (optional):");
                      updateVerificationStatus(seller.id, 'rejected', notes);
                    }}
                  >
                    Reject
                  </button>
                </>
              )}
              {seller.verificationStatus === 'rejected' && (
                <button 
                  className="approve-btn"
                  onClick={() => updateVerificationStatus(seller.id, 'approved')}
                >
                  Re-approve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedSeller && (
        <div className="document-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Verification Documents - {selectedSeller.businessName}</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedSeller(null)}
              >
                ×
              </button>
            </div>
            <div className="documents-grid">
              {selectedSeller.verificationDocuments && Object.entries(selectedSeller.verificationDocuments).map(([type, doc]) => (
                <div key={type} className="document-item">
                  <h4>{type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                  <img 
                    src={doc.url} 
                    alt={type}
                    onClick={() => window.open(doc.url, '_blank')}
                  />
                  <p>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
            <div className="modal-actions">
              <button 
                className="approve-btn"
                onClick={() => {
                  updateVerificationStatus(selectedSeller.id, 'approved');
                  setSelectedSeller(null);
                }}
              >
                Approve
              </button>
              <button 
                className="reject-btn"
                onClick={() => {
                  const notes = prompt("Reason for rejection:");
                  updateVerificationStatus(selectedSeller.id, 'rejected', notes);
                  setSelectedSeller(null);
                }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
