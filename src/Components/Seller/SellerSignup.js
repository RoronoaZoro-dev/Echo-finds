import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { signUpSeller } from "../../firebase/sellerAuthService";
import { SellerContext } from "../../contextStore/SellerContext";
import { useNotification } from "../Notification/NotificationProvider";
import { validateEmail, validatePassword, validatePhoneNumber } from "../../utils/errorHandler";
import SignUpLoading from "../Loading/SignUpLoading";
import "./SellerSignup.css";

export default function SellerSignup() {
  const history = useHistory();
  const { setSeller, setSellerProfile } = useContext(SellerContext);
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState({
    businessName: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    businessType: "",
    ecoCertification: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.businessName.trim()) {
      errors.businessName = "Business name is required";
    }
    
    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!validatePhoneNumber(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.address.trim()) {
      errors.address = "Business address is required";
    }
    
    if (!formData.businessType) {
      errors.businessType = "Business type is required";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.errors[0];
      }
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setValidationErrors({});

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const result = await signUpSeller(formData.email, formData.password, formData);
    
    if (result.success) {
      setSeller(result.user);
      setSellerProfile(result.sellerData);
      showSuccess(result.message || "Seller account created successfully! Please check your email to verify your account.");
      history.push("/seller/dashboard");
    } else {
      setError(result.error);
      showError(result.error);
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <SignUpLoading />}
      <div className="seller-signup-container">
        <div className="seller-signup-form">
          <div className="eco-header">
            <h1>🌱 EcoFinds</h1>
            <h2>Join as a Seller</h2>
            <p>Help create a sustainable marketplace for eco-friendly products</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  placeholder="Your business or store name"
                />
                {validationErrors.businessName && <div className="error-message" style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{validationErrors.businessName}</div>}
              </div>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
                {validationErrors.fullName && <div className="error-message" style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{validationErrors.fullName}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
                {validationErrors.email && <div className="error-message" style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{validationErrors.email}</div>}
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+1 (555) 123-4567"
                />
                {validationErrors.phone && <div className="error-message" style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{validationErrors.phone}</div>}
              </div>
            </div>

            <div className="form-group">
              <label>Business Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Complete business address"
                rows="3"
              />
              {validationErrors.address && <div className="error-message" style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{validationErrors.address}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Business Type *</label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Business Type</option>
                  <option value="individual">Individual Seller</option>
                  <option value="small-business">Small Business</option>
                  <option value="eco-store">Eco Store</option>
                  <option value="thrift-shop">Thrift Shop</option>
                  <option value="vintage-dealer">Vintage Dealer</option>
                  <option value="upcycling-artisan">Upcycling Artisan</option>
                </select>
                {validationErrors.businessType && <div className="error-message" style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{validationErrors.businessType}</div>}
              </div>
              <div className="form-group">
                <label>Eco Certification</label>
                <input
                  type="text"
                  name="ecoCertification"
                  value={formData.ecoCertification}
                  onChange={handleChange}
                  placeholder="e.g., Fair Trade, Organic, etc."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="Minimum 6 characters"
                />
                {validationErrors.password && <div className="error-message" style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{validationErrors.password}</div>}
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                />
                {validationErrors.confirmPassword && <div className="error-message" style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{validationErrors.confirmPassword}</div>}
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="eco-button">
              Create Seller Account
            </button>
          </form>

          <div className="auth-links">
            <p>Already have a seller account? <Link to="/seller/login">Sign In</Link></p>
            <p>Want to buy instead? <Link to="/login">Customer Login</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}
