import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import Logo from "../../olx-logo.png";
import "./Signup.css";
import { signUpWithEmail, signInWithGoogle } from "../../firebase/authService";
import { AuthContext } from "../../contextStore/AuthContext";
import { useNotification } from "../Notification/NotificationProvider";
import { validateEmail, validatePassword, validatePhoneNumber } from "../../utils/errorHandler";
import { useHistory } from "react-router";
import SignUpLoading from "../Loading/SignUpLoading";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function Signup() {
  const history = useHistory();
  const { setUser } = useContext(AuthContext);
  const { showSuccess, showError } = useNotification();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!name.trim()) {
      errors.name = "Full name is required";
    }
    
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!validatePhoneNumber(phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    
    if (!password) {
      errors.password = "Password is required";
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.errors[0];
      }
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
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

    const result = await signUpWithEmail(email, password, name);
    
    if (result.success) {
      // Save additional user data to Firestore
      try {
        await setDoc(doc(db, "users", result.user.uid), {
          id: result.user.uid,
          name: name,
          phone: phone,
          email: email,
          createdAt: new Date().toISOString()
        });
        setUser(result.user);
        showSuccess(result.message || "Account created successfully! Please check your email to verify your account.");
        history.push("/");
      } catch (dbError) {
        setError("Account created but failed to save profile data: " + dbError.message);
        showError("Account created but failed to save profile data: " + dbError.message);
      }
    } else {
      setError(result.error);
      showError(result.error);
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError("");

    console.log("🔍 Starting Google sign-up process...");
    
    try {
      const result = await signInWithGoogle();
      console.log("📊 Google sign-up result:", result);
      
      if (result.success) {
        console.log("✅ Google authentication successful, saving user data...");
        // Save additional user data to Firestore
        try {
          await setDoc(doc(db, "users", result.user.uid), {
            id: result.user.uid,
            name: result.user.displayName || "Google User",
            email: result.user.email,
            createdAt: new Date().toISOString()
          });
          console.log("✅ User data saved to Firestore");
          setUser(result.user);
          showSuccess(result.message || "Account created successfully! Welcome to EcoFinds.");
          history.push("/");
        } catch (dbError) {
          console.error("❌ Error saving user data:", dbError);
          setError("Account created but failed to save profile data: " + dbError.message);
          showError("Account created but failed to save profile data: " + dbError.message);
        }
      } else {
        console.error("❌ Google authentication failed:", result.error);
        setError(result.error);
        showError(result.error);
      }
    } catch (error) {
      console.error("❌ Unexpected error during Google sign-up:", error);
      setError("An unexpected error occurred: " + error.message);
      showError("An unexpected error occurred: " + error.message);
    }
    setLoading(false);
  };
  return (
    <>
      {loading && <SignUpLoading />}
      <div>
        <div className="signupParentDiv">
          <img width="200px" height="200px" src={Logo} alt=""></img>
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <br />
            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              name="name"
              required
              placeholder="Enter your full name"
            />
            {validationErrors.name && <div className="error-message" style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{validationErrors.name}</div>}
            <br />
            <label>Email</label>
            <br />
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              required
              placeholder="your@email.com"
            />
            {validationErrors.email && <div className="error-message" style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{validationErrors.email}</div>}
            <br />
            <label>Phone</label>
            <br />
            <input
              className="input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              name="phone"
              required
              placeholder="+1 (555) 123-4567"
            />
            {validationErrors.phone && <div className="error-message" style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{validationErrors.phone}</div>}
            <br />
            <label>Password</label>
            <br />
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              required
              minLength="6"
              placeholder="Minimum 6 characters"
            />
            {validationErrors.password && <div className="error-message" style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{validationErrors.password}</div>}
            <br />
            <label>Confirm Password</label>
            <br />
            <input
              className="input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              name="confirmPassword"
              required
              placeholder="Confirm your password"
            />
            {validationErrors.confirmPassword && <div className="error-message" style={{color: 'red', fontSize: '12px', margin: '5px 0'}}>{validationErrors.confirmPassword}</div>}
            <br />
            {error && <div className="error-message" style={{color: 'red', margin: '10px 0'}}>{error}</div>}
            <br />
            <button type="submit">Signup</button>
          </form>
          <div style={{ margin: '20px 0' }}>
            <button 
              onClick={handleGoogleSignUp}
              style={{
                backgroundColor: '#4285f4',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Sign up with Google
            </button>
          </div>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </>
  );
}
