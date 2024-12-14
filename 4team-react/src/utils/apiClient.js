import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8989",
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true // 쿠키를 주고받을 수 있도록 설정
});

// 요청 인터셉터 - JWT 토큰이 있으면 헤더에 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 401 에러 시 로그인 페이지로 리다이렉트
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
