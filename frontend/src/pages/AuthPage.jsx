import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthPage.css";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState(""); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError(null); // Clear error when switching modes
  };
  
  const url = "http://127.0.0.1:5000"

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (isSignUp && password === confirmPassword) {
      // Sign-Up Logic
      axios.post(`${url}/register`, {
        username: username,
        email: email,
        password: password
      }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      })
      .then((response) => {
        const jsonResponse = response.data;
      
        if (jsonResponse.error) {
          setError(jsonResponse.error);
          return;
        }
      
        if (jsonResponse.message) {
          setIsSignUp((prev) => !prev);
        }
      })
      .catch((error) => {
        console.error("Error during Axios request:", error);
        if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else {
          setError("An unexpected error occurred.");
        }
      });
      
    } else if(!isSignUp){
      // Log-In Logic
      axios.post(`${url}/login`, {
        email: email,
        password: password
      }, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true // This replaces 'credentials: include'
      })
      .then((response) => {
        const jsonResponse = response.data;
        console.log(jsonResponse);
      
        if (jsonResponse.error) {
          setError(jsonResponse.error);
          return;
        }
      
        if (jsonResponse.message) {
          navigate("/app");
        }
      })
      .catch((error) => {
        console.error("Error during Axios request:", error);
        if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else {
          setError("An unexpected error occurred.");
        }
      });
    }
    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
        <form onSubmit={handleAuthSubmit} className="auth-form">
          {/* Username Input (only for Sign Up) */}
          {isSignUp && (
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
          )}

          {/* Email Input */}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Confirm Password Input (only for Sign Up) */}
          {isSignUp && (
            <div className="input-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          {/* Error message */}
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-btn">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <span onClick={toggleAuthMode} className="auth-toggle-link">
                Sign In
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span onClick={toggleAuthMode} className="auth-toggle-link">
                Sign Up
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;