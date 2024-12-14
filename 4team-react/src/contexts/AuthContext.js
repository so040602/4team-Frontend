import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 페이지 로드 시 로컬 스토리지의 토큰으로 사용자 정보 가져오기
    const token = localStorage.getItem("token");
    if (token) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post("/api/auth/login", {
        email,
        password
      });
      const { token, member } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(member));
      setUser(member);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "로그인에 실패했습니다."
      };
    }
  };

  const signup = async (email, password, displayName) => {
    try {
      const response = await apiClient.post("/api/auth/signup", {
        email,
        password,
        displayName
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "회원가입에 실패했습니다."
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const checkEmailDuplicate = async (email) => {
    try {
      const response = await apiClient.get(
        `/api/auth/check/email?email=${email}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error("이메일 중복 확인에 실패했습니다.");
    }
  };

  const checkDisplayNameDuplicate = async (displayName) => {
    try {
      const response = await apiClient.get(
        `/api/auth/check/displayName?displayName=${displayName}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error("닉네임 중복 확인에 실패했습니다.");
    }
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    signup,
    logout,
    checkEmailDuplicate,
    checkDisplayNameDuplicate
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
