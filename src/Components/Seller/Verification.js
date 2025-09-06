import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { SellerContext } from "../../contextStore/SellerContext";
import { uploadVerificationDocuments } from "../../firebase/sellerAuthService";
import { storage } from "../../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import GoLoading from "../Loading/GoLoading";
import "./Verification.css";

export default function Verification() {
  const history = useHistory();
  const { seller, sellerProfile } = useContext(SellerContext);
  const [documents, setDocuments] = useState({
    idDocument: null,
    businessLicense: null,
    ecoCertification: null,
    addressProof: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleDocumentChange = (type, file) => {
    setDocuments(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const uploadDocument = async (file, type) => {
    const fileRef = ref(storage, `verification/${seller.uid}/${type}_${Date.now()}`);
    const snapshot = await uploadBytes(fileRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const uploadedDocuments = {};

      // Upload each document
      for (const [type, file] of Object.entries(documents)) {
        if (file) {
          const url = await uploadDocument(file, type);
          uploadedDocuments[type] = {
            url,
            name: file.name,
            uploadedAt: new Date().toISOString()
          };
        }
      }

      // Submit verification documents
      const result = await uploadVerificationDocuments(seller.uid, uploadedDocuments);
      
      if (result.success) {
        setSuccess("Verification documents submitted successfully! We'll review them within 2-3 business days.");
        setTimeout(() => {
          history.push("/seller/dashboard");
        }, 3000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      setError("Error uploading documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatus = () => {
    if (!sellerProfile) return { status: 'unknown', message: 'Loading...', color: '#gray' };
    
    switch (sellerProfile.verificationStatus) {
      case 'approved':
        return { 
          status: 'approved', 
          message: 'Verified Seller', 
          color: '#4CAF50',
          description: 'Your account has been verified. You can now access all seller features.'
        };
      case 'pending':
        return { 
          status: 'pending', 
          message: 'Verification Pending', 
          color: '#FF9800',
          description: 'Your documents are under review. We\'ll notify you once the verification is complete.'
        };
      case 'rejected':
        return { 
          status: 'rejected', 
          message: 'Verification Rejected', 
          color: '#F44336',
          description: 'Your verification was rejected. Please review the requirements and resubmit.'
        };
      default:
        return { 
          status: 'not-submitted', 
          message: 'Not Verified', 
          color: '#9E9E9E',
          description: 'Complete verification to build trust with buyers and unlock all features.'
        };
    }
  };

  const verificationStatus = getVerificationStatus();

  if (!seller) {
    history.push("/seller/login");
    return null;
  }

  return (
    <>
      {loading && <GoLoading />}
      <div className="verification-container">
        <div className="verification-form">
          <div className="form-header">
            <h1>🌱 Seller Verification</h1>
            <p>Complete verification to build trust with buyers and unlock all features</p>
          </div>

          <div className="verification-status-card">
            <div className="status-info">
              <h3>Current Status</h3>
              <div className="status-display">
                <span 
                  className="status-indicator"
                  style={{ backgroundColor: verificationStatus.color }}
                >
                  {verificationStatus.message}
                </span>
                <p>{verificationStatus.description}</p>
              </div>
            </div>
          </div>

          {verificationStatus.status !== 'approved' && (
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h3>Required Documents</h3>
                <p className="help-text">
                  Please upload clear, readable images of the following documents. 
                  All documents will be kept secure and confidential.
                </p>

                <div className="document-upload">
                  <div className="upload-group">
                    <label>Government ID *</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleDocumentChange('idDocument', e.target.files[0])}
                      required
                    />
                    <p className="help-text">Driver's license, passport, or national ID</p>
                  </div>

                  <div className="upload-group">
                    <label>Business License (if applicable)</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleDocumentChange('businessLicense', e.target.files[0])}
                    />
                    <p className="help-text">Required for business accounts</p>
                  </div>

                  <div className="upload-group">
                    <label>Eco Certification (if applicable)</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleDocumentChange('ecoCertification', e.target.files[0])}
                    />
                    <p className="help-text">Fair Trade, Organic, or other eco certifications</p>
                  </div>

                  <div className="upload-group">
                    <label>Address Proof *</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleDocumentChange('addressProof', e.target.files[0])}
                      required
                    />
                    <p className="help-text">Utility bill, bank statement, or lease agreement</p>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Verification Guidelines</h3>
                <ul className="guidelines-list">
                  <li>All documents must be clear and readable</li>
                  <li>Documents should be recent (within 3 months for address proof)</li>
                  <li>File formats accepted: JPG, PNG, PDF</li>
                  <li>Maximum file size: 5MB per document</li>
                  <li>Verification typically takes 2-3 business days</li>
                </ul>
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => history.push("/seller/dashboard")}
                >
                  Back to Dashboard
                </button>
                <button type="submit" className="eco-button">
                  Submit for Verification
                </button>
              </div>
            </form>
          )}

          {verificationStatus.status === 'approved' && (
            <div className="approved-message">
              <h3>✅ Verification Complete!</h3>
              <p>Your seller account has been verified. You now have access to all features including:</p>
              <ul>
                <li>Unlimited product listings</li>
                <li>Advanced analytics</li>
                <li>Priority customer support</li>
                <li>Verified seller badge</li>
              </ul>
              <button 
                className="eco-button"
                onClick={() => history.push("/seller/dashboard")}
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
