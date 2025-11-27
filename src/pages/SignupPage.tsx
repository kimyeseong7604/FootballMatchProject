import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../api/apiClient';
import { useForm } from '../hooks/useForm';
import styles from './Form.module.css';

// 폼 데이터 타입 정의
interface SignupFormData {
  email: string;
  password: string;
  passwordcheck: string;
  username: string;
  birthday: string;
}

// 초기 폼 데이터
const initialFormData: SignupFormData = {
  email: '',
  password: '',
  passwordcheck: '',
  username: '',
  birthday: ''
};

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const { values, handleChange, resetForm } = useForm(initialFormData);

  // 상태 관리 (UI 피드백)
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 초기 에러 상태 초기화
    setError(null);
    setSuccessMessage(null);

    // --- 클라이언트 측 유효성 검사 시작 ---
    if (!values.username.trim()) {
      setError('유저 이름은 필수 입력 항목입니다.');
      return;
    }
    // 이메일 형식 검사: 간단한 패턴 사용 (\S+@\S+\.\S+)
    if (!values.email.trim() || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(values.email)) {
      setError('유효한 이메일 주소를 입력해야 합니다.');
      return;
    }
    if (values.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    if (values.password !== values.passwordcheck) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!values.birthday.trim()) {
      setError('생년월일은 필수 입력 항목입니다.');
      return;
    }
    // --- 클라이언트 측 유효성 검사 끝 ---


    setIsLoading(true);

    try {
      await apiClient.post('/users/signup', {
        name: values.username,
        email: values.email,
        password: values.password,
        birth_date: values.birthday
      }
      );

      setSuccessMessage('회원 가입이 성공적으로 완료되었습니다. 잠시 후 로그인 페이지로 이동합니다.');
      resetForm();

      // 성공 후 로그인 페이지로 자동 이동
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // 백엔드 에러 메시지
        setError(err.response.data.error || '회원 가입 중 알 수 없는 오류가 발생했습니다.');
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
      <Link to="/" className={styles.homeLink}>
        홈으로
      </Link>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>회원가입</h2>

        {/* 회원이름 */}
        <div className={styles.inputGroup}>
          <label htmlFor="username">회원 이름:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={values.username}
            onChange={handleChange}
            required
            placeholder="회원님의 이름을 입력하세요."
          />
        </div>

        {/* 생년월일 */}
        <div className={styles.inputGroup}>
          <label htmlFor="birthday">생년월일:</label>
          <input
            type="date"
            id="birthday"
            name="birthday"
            value={values.birthday}
            onChange={handleChange}
            required
          />
        </div>

        {/* 이메일 (로그인용) */}
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

        {/* 비밀번호 */}
        <div className={styles.inputGroup}>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            required
            placeholder="6자 이상이어야 합니다."
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className={styles.inputGroup}>
          <label htmlFor="passwordcheck">비밀번호 확인:</label>
          <input
            type="password"
            id="passwordcheck"
            name="passwordcheck"
            value={values.passwordcheck}
            onChange={handleChange}
            required
            placeholder="위 비밀번호와 같아야 합니다."
          />
        </div>

        {error && <p className={styles.errorMsg}>🚨 {error}</p>}
        {successMessage && <p className={styles.successMsg}>✅ {successMessage}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? '가입 요청 중...' : '가입하기'}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;