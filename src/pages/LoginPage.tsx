import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../api/apiClient';
import { useForm } from '../hooks/useForm';
import styles from './Form.module.css';

interface LoginFormData {
  email: string;
  password: string;
}

const initialFormData: LoginFormData = {
  email: '',
  password: '',
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { values, handleChange, resetForm } = useForm(initialFormData);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLogin(true);

    try {
      // -----------------------------
      // 백엔드 로그인 API 호출
      // -----------------------------
      const response = await apiClient.post('/users/login', {
        email: values.email,
        password: values.password,
      });

      // -----------------------------
      // JWT 토큰 저장 (sessionStorage 사용)
      // -----------------------------
      const { token, user } = response.data;
      sessionStorage.setItem('authToken', token);  // 프론트에서 인증 시 사용
      sessionStorage.setItem('userInfo', JSON.stringify(user));

      setSuccessMessage('로그인 성공! 잠시 후 메인 페이지로 이동합니다.');
      resetForm();

      // 메인 페이지로 이동
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.console.error || "아이디 또는 비밀번호를 다시 확인해주세요.");
      } else {
        setError('네트워크 오류 또는 서버에 연결할 수 없습니다.');
      }
    } finally {
      setIsLogin(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <Link to="/" className={styles.homeLink}>홈으로</Link>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>로그인</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            required
            placeholder="login@mail.com"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className={styles.errorMsg}>🚨 {error}</p>}
        {successMessage && <p className={styles.successMsg}>✅ {successMessage}</p>}

        <button
          type="submit"
          disabled={isLogin}
          className={styles.submitButton}
        >
          {isLogin ? '로그인 중...' : '로그인'}
        </button>
        <button
          type="submit"
          onClick={()=> navigate('/signup')}
          className={styles.submitButton}
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default LoginPage;