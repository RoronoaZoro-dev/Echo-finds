import React, { useState, useContext } from "react";
import { useHistory } from "react-router";
import { signInAdmin } from "../../firebase/adminAuthService";
import { AdminContext } from "../../contextStore/AdminContext";
import { useNotification } from "../Notification/NotificationProvider";
import { validateEmail } from "../../utils/errorHandler";
import RoundLoading from "../Loading/RoundLoading";
import "./AdminLogin.css";

export default function AdminLogin() {
  const history = useHistory();
  const { setAdmin, setAdminProfile } = useContext(AdminContext);
  const { showSuccess, showError } = useNotification();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    const result = await signInAdmin(formData.email, formData.password);
    
    if (result.success) {
      setAdmin(result.user);
      setAdminProfile(result.adminData);
      showSuccess(result.message || "Welcome back! You have been signed in successfully.");
      history.push("/admin/dashboard");
    } else {
      setError(result.error);
      showError(result.error);
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <RoundLoading />}
      <div className="admin-login-container">
        <div className="admin-login-form">
          <div className="admin-header">
            <h1>🌱 EcoFinds</h1>
            <h2>Admin Login</h2>
            <p>Secure access to the admin dashboard</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Admin Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@ecofinds.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Your admin password"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="admin-button">
              Sign In
            </button>
          </form>

          <div className="admin-links">
            <p><a href="/">Back to Main Site</a></p>
            <p><a href="/login">Customer Login</a></p>
            <p><a href="/seller/login">Seller Login</a></p>
          </div>
        </div>
      </div>
    </>
  );
}
