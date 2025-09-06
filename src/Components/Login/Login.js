import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { signInWithEmail, signInWithGoogle, resetPassword } from "../../firebase/authService";
import { AuthContext } from "../../contextStore/AuthContext";
import { useNotification } from "../Notification/NotificationProvider";
import { validateEmail } from "../../utils/errorHandler";
import RoundLoading from "../Loading/RoundLoading";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const history = useHistory();
  const { setUser } = useContext(AuthContext);
  const { showSuccess, showError } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    const result = await signInWithEmail(email, password);
    
    if (result.success) {
      setUser(result.user);
      showSuccess(result.message || "Welcome back! You have been signed in successfully.");
      history.push("/");
    } else {
      setError(result.error);
      showError(result.error);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        setUser(result.user);
        showSuccess(result.message || "Welcome back! You have been signed in successfully.");
        history.push("/");
      } else {
        console.error("Google sign-in failed:", result);
        setError(result.error);
        showError(result.error);
      }
    } catch (error) {
      console.error("Unexpected error during Google sign-in:", error);
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      showError(errorMessage);
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setError("");

    if (!forgotPasswordEmail) {
      setError("Please enter your email address");
      setForgotPasswordLoading(false);
      return;
    }

    if (!validateEmail(forgotPasswordEmail)) {
      setError("Please enter a valid email address");
      setForgotPasswordLoading(false);
      return;
    }

    const result = await resetPassword(forgotPasswordEmail);
    
    if (result.success) {
      showSuccess(result.message || "Password reset email sent! Please check your inbox.");
      setShowForgotPassword(false);
      setForgotPasswordEmail("");
    } else {
      setError(result.error);
      showError(result.error);
    }
    setForgotPasswordLoading(false);
  };
  return (
    <>
      {(loading || forgotPasswordLoading) && <RoundLoading />}
      <div>
        <div className="loginParentDiv">
          
          {!showForgotPassword ? (
            <>
              <form onSubmit={handleSubmit}>
                <label>Email</label>
                <br />
                <input
                  className="input"
                  type="email"
                  placeholder="your@email.com"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <br />
                <label>Password</label>
                <br />
                <input
                  className="input"
                  type="password"
                  name="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <br />
                {error && <div className="error-message" style={{color: 'red', margin: '10px 0'}}>{error}</div>}
                <br />
                <button type="submit">Login</button>
              </form>
              <div style={{ margin: '20px 0' }}>
                <button 
                  onClick={handleGoogleSignIn}
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
                  Sign in with Google
                </button>
              </div>
              <div style={{ margin: '10px 0' }}>
                <button 
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4285f4',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <Link to="/signup">Signup</Link>
            </>
          ) : (
            <div>
              <h3>Reset Password</h3>
              <form onSubmit={handleForgotPassword}>
                <label>Email</label>
                <br />
                <input
                  className="input"
                  type="email"
                  placeholder="Enter your email address"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                />
                <br />
                {error && <div className="error-message" style={{color: 'red', margin: '10px 0'}}>{error}</div>}
                <br />
                <button type="submit">Send Reset Email</button>
              </form>
              <div style={{ margin: '10px 0' }}>
                <button 
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError("");
                    setForgotPasswordEmail("");
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#4285f4',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Back to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
