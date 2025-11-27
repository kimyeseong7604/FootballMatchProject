import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';

// 임시 메인 페이지 컴포넌트
const HomePage: React.FC = () => {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    setTimeout(() => setIsLoggedIn(!!token), 0);
  }, []);


  const handleLogout = () => {
    sessionStorage.removeItem('authToken'); // 토큰 제거
    setIsLoggedIn(false);
    navigate('/'); // 홈으로 이동
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>환영합니다!</h1>
      <p>인증 기능이 필요한 페이지입니다.</p>

      {!isLoggedIn ? (
        <>
          <Link to="/login" style={{ marginRight: '10px', color: '#007bff' }}>로그인</Link>
        </>
      ) : (
        <>
          <button
            onClick={handleLogout}
            style={{ marginRight: '10px', color: '#007bff', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            로그아웃
          </button>
          <Link to="/profile" style={{ color: '#007bff' }}>개인정보수정</Link>
        </>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* 개인정보 수정 페이지는 추후 ProfilePage 컴포넌트 생성 */}
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
