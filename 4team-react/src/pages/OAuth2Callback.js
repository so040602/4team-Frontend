import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import apiClient from "../utils/apiClient";

function OAuth2Callback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 임시 토큰을 새로운 토큰으로 교체
        const response = await apiClient.post("/api/auth/token/refresh");
        const { token, member } = response.data.data;

        // 토큰과 사용자 정보 저장
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(member));
        setUser(member);

        // 메인 페이지로 리다이렉트
        navigate("/");
      } catch (error) {
        console.error("OAuth2 callback error:", error);
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate, setUser]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}
    >
      <div>로그인 처리중...</div>
    </div>
  );
}

export default OAuth2Callback;
