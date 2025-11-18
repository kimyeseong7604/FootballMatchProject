import axios from 'axios';

// 1. 환경 변수에서 기본 URL을 가져옵니다.
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 2. 기본 설정을 가진 axios 인스턴스를 생성합니다.
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. 인터셉터: 모든 요청에 토큰을 자동으로 포함 (로그인 상태 유지)
apiClient.interceptors.request.use(config => {
  // localStorage에 저장된 인증 토큰을 가져옵니다.
  const token = localStorage.getItem('authToken'); 
  
  if (token) {
    // 백엔드가 요구하는 형식에 맞춰 Authorization 헤더에 토큰을 추가합니다.
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;