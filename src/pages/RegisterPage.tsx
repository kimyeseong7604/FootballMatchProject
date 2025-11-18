import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../api/apiClient';
import { useForm } from '../hooks/useForm';
import styles from './RegisterPage.module.css'; // CSS Module 임포트

// 폼 데이터 타입 정의
interface RegisterFormData {
  email: string;
  password: string;
  teamname: string;
}

// 초기 폼 데이터
const initialFormData: RegisterFormData = { email: '', password: '', teamname: '' };

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. 폼 데이터 관리 로직
  const { values, handleChange, resetForm } = useForm(initialFormData);

  // 2. 상태 관리 (UI 피드백)
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 클라이언트 측 유효성 검사
    if (values.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // 3. 백엔드 API 호출
      await apiClient.post('/auth/register', values);
      
      // 성공 처리
      setSuccessMessage('회원가입이 성공적으로 완료되었습니다. 잠시 후 로그인 페이지로 이동합니다.');
      resetForm();

      // 성공 후 로그인 페이지로 자동 이동
      setTimeout(() => {
          navigate('/login'); 
      }, 1500);

    } catch (err) {
      // 4. 에러 응답 처리
      if (axios.isAxiosError(err) && err.response) {
        // 백엔드 에러 메시지
        const msg = err.response.data.message || `서버 오류: ${err.response.status}`;
        setError(msg);
      } else {
        // 네트워크 에러
        setError('네트워크 오류 또는 서버에 연결할 수 없습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>📝 팀원 가입</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* 이메일 입력 필드 */}
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>이메일:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            required
            placeholder="example@email.com"
            className={styles.input}
          />
        </div>
        
        {/* 비밀번호 입력 필드 */}
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>비밀번호:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            required
            placeholder="6자 이상이어야 합니다."
            className={styles.input}
          />
        </div>

        {/* 팀 이름 입력 필드 */}
        <div className={styles.inputGroup}>
          <label htmlFor="teamname" className={styles.label}>팀이름:</label>
          <input
            type="text"
            id="teamname"
            name="teamname"
            value={values.teamname}
            onChange={handleChange}
            required
            placeholder="팀이름 입력"
            className={styles.input}
          />
        </div>

        {/* 에러 및 성공 메시지 출력 */}
        {error && <p className={styles.errorMsg}>🚨 {error}</p>}
        {successMessage && <p className={styles.successMsg}>✅ {successMessage}</p>}
        
        {/* 제출 버튼 */}
        <button 
          type="submit" 
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? '가입 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;