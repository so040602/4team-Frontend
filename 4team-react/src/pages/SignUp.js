import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signup(
        formData.email,
        formData.password,
        formData.displayName
      );
      if (result.success) {
        navigate("/login"); // 회원가입 성공시 로그인 페이지로 이동
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="signup-container">
      <h1>회원가입</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <input
          type="text"
          name="displayName"
          placeholder="닉네임"
          value={formData.displayName}
          onChange={(e) =>
            setFormData({ ...formData, displayName: e.target.value })
          }
          required
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="signup-button">
          회원가입
        </button>
      </form>
      <div className="login-link">
        이미 계정이 있으신가요? <a href="/login">로그인하기</a>
      </div>
    </div>
  );
}

export default SignUp;
