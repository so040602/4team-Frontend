import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1 onClick={() => navigate("/")}>Recipe App</h1>
      </div>
      <div className="navbar-menu">
        {user ? (
          <div className="navbar-user">
            <span className="user-name">Welcome, {user.displayName}!</span>
            <button className="logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={handleLogin}>
            로그인
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
