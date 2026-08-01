import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaUsers, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

/**
 * Props:
 * - onLoginSuccess(username): called once credentials are accepted, before
 *   navigating away. Use it to store the auth flag / admin name in App.
 *
 * This is a demo login — any non-empty username + password is accepted.
 * Swap `handleSubmit` for a real API call when you have a backend.
 */
export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setError("");
    onLoginSuccess(username.trim(), remember);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="icon-circle">
          <FaUsers />
        </div>

        <h1>
          <span>Login</span> Account
        </h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-username">Username</label>
          <div className="input-box">
            <input
              id="login-username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <FaUser className="input-icon" />
          </div>

          <label htmlFor="login-password">Password</label>
          <div className="input-box">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword((s) => !s)}
              role="button"
              tabIndex={0}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="login-error">{error}</p>}

          <div className="options">
            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember Me
            </label>
            <a href="#forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
