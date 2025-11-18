import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';

// 임시 로그인 페이지 컴포넌트 (나중에 구현)
const LoginPage = () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>로그인 페이지</h1>
        <p>지금은 회원가입만 구현되어 있습니다.</p>
        <Link to="/register" style={{ color: '#007bff' }}>회원가입 하러 가기</Link>
    </div>
);

// 임시 메인 페이지 컴포넌트
const HomePage = () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>환영합니다!</h1>
        <p>인증 기능이 필요한 페이지입니다.</p>
        <Link to="/login" style={{ marginRight: '10px', color: '#007bff' }}>로그인</Link>
        <Link to="/register" style={{ color: '#007bff' }}>회원가입</Link>
    </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;