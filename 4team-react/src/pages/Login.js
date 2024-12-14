import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

const NaverIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.5615 10.4773L6.14589 0H0V20H6.43844V9.52273L13.8541 20H20V0H13.5615V10.4773Z"
      fill="white"
    />
  </svg>
);

const KakaoIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10 0C4.47715 0 0 3.55071 0 7.93125C0 10.7938 1.95322 13.2937 4.92432 14.7091L3.67517 19.3623C3.58817 19.6457 3.91191 19.8714 4.15457 19.7127L9.60382 16.1716C9.73363 16.1716 9.86344 16.1716 10 16.1716C15.5229 16.1716 20 12.6209 20 8.24038C20 3.85988 15.5229 0 10 0Z"
      fill="black"
    />
  </svg>
);

const GoogleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.6 10.2273C19.6 9.51819 19.5364 8.83637 19.4182 8.18182H10V12.0455H15.3818C15.15 13.3 14.4455 14.3591 13.3864 15.0682V17.5773H16.6182C18.5091 15.8364 19.6 13.2727 19.6 10.2273Z"
      fill="#4285F4"
    />
    <path
      d="M10 20C12.7 20 14.9636 19.1045 16.6182 17.5773L13.3864 15.0682C12.4909 15.6682 11.3455 16.0227 10 16.0227C7.39545 16.0227 5.19091 14.2636 4.40455 11.9H1.06364V14.4909C2.70909 17.7591 6.09091 20 10 20Z"
      fill="#34A853"
    />
    <path
      d="M4.40455 11.9C4.20455 11.3 4.09091 10.6591 4.09091 10C4.09091 9.34091 4.20455 8.7 4.40455 8.1V5.50909H1.06364C0.386364 6.85909 0 8.38636 0 10C0 11.6136 0.386364 13.1409 1.06364 14.4909L4.40455 11.9Z"
      fill="#FBBC05"
    />
    <path
      d="M10 3.97727C11.4682 3.97727 12.7864 4.48182 13.8227 5.47273L16.6909 2.60455C14.9591 0.990909 12.6955 0 10 0C6.09091 0 2.70909 2.24091 1.06364 5.50909L4.40455 8.1C5.19091 5.73636 7.39545 3.97727 10 3.97727Z"
      fill="#EA4335"
    />
  </svg>
);

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate("/"); // 로그인 성공시 메인 페이지로 이동
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onNaverLogin = () => {
    window.location.href = "http://localhost:8989/oauth2/authorization/naver";
  };

  const onKakaoLogin = () => {
    window.location.href = "http://localhost:8989/oauth2/authorization/kakao";
  };

  const onGoogleLogin = () => {
    window.location.href = "http://localhost:8989/oauth2/authorization/google";
  };

  return (
    <div className="login-container">
      <h1 className="login-title">로그인</h1>

      {/* 이메일 로그인 폼 */}
      <form onSubmit={handleSubmit} className="email-login-form">
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="email-submit-btn" disabled={isLoading}>
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="divider">
        <span>또는</span>
      </div>

      {/* 소셜 로그인 버튼들 */}
      <button
        className="social-login-button naver-login-btn"
        onClick={onNaverLogin}
      >
        <div className="button-content">
          <NaverIcon />
          <span>네이버로 시작하기</span>
        </div>
      </button>

      <button
        className="social-login-button kakao-login-btn"
        onClick={onKakaoLogin}
      >
        <div className="button-content">
          <KakaoIcon />
          <span>카카오로 시작하기</span>
        </div>
      </button>

      <button
        className="social-login-button google-login-btn"
        onClick={onGoogleLogin}
      >
        <div className="button-content">
          <GoogleIcon />
          <span>구글로 시작하기</span>
        </div>
      </button>

      <div className="signup-link">
        계정이 없으신가요? <a href="/signup">회원가입하기</a>
      </div>
    </div>
  );
}

export default Login;
