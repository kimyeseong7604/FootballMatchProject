import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import apiClient from '../api/apiClient';
import { useForm } from '../hooks/useForm';
import styles from './RegisterPage.module.css';

// 폼 데이터 타입 정의
interface RegisterFormData {
  teamname: string;
  region: string;
  membercount: number; // 5, 7, 11 중 하나
  activityday: string; // 월~일 중 하나
  email: string;
  password: string;
  introduction: string; // textarea
  contact: string;
  level: number; // 1~5 중 하나
}

// 초기 폼 데이터
const initialFormData: RegisterFormData = {
  teamname: '',
  region: '',
  membercount: 0,
  activityday: '',
  email: '',
  password: '',
  introduction: '',
  contact: '',
  level: 0
};

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const MEMBER_COUNTS = [5, 7, 11];
const LEVELS = [1, 2, 3, 4, 5];

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const { values, handleChange, setValues, resetForm } = useForm(initialFormData);

  // 상태 관리 (UI 피드백)
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 단일 선택 버튼 핸들러 (membercount, activityday, level 처리)
  const handleSelect = useCallback((name: keyof RegisterFormData, value: string | number) => {
    
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  }, [setValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 초기 에러 상태 초기화
    setError(null);
    setSuccessMessage(null);

    // --- 클라이언트 측 유효성 검사 시작 ---
    if (!values.teamname.trim()) {
      setError('팀 이름은 필수 입력 항목입니다.');
      return;
    }
    if (!values.region.trim()) {
      setError('활동 지역은 필수 입력 항목입니다.');
      return;
    }
    if (values.activityday === '') {
      setError('주요 활동 요일을 선택해야 합니다.');
      return;
    }
    // 이메일 형식 검사: 간단한 패턴 사용 (\S+@\S+\.\S+)
    if (!values.email.trim() || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.email)) {
      setError('유효한 이메일 주소를 입력해야 합니다.');
      return;
    }
    if (values.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    // --- 클라이언트 측 유효성 검사 끝 ---


    setIsLoading(true);

    try {
      // API 호출 시 membercount는 숫자로 전송됩니다.
      await apiClient.post('/api/auth/register', {
        team_name: values.teamname,
        region: values.region,
        member_count: values.membercount,
        activity_day: values.activityday,
        email: values.email,
        password: values.password,
        introduction: values.introduction,
        contact: values.contact,
        level: values.level,
      }
      );

      setSuccessMessage('팀 가입이 성공적으로 완료되었습니다. 잠시 후 로그인 페이지로 이동합니다.');
      resetForm();

      // 성공 후 로그인 페이지로 자동 이동
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        // 백엔드 에러 메시지
        setError(err.response.data.message || '팀 가입 중 알 수 없는 오류가 발생했습니다.');
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
        <h2>팀 가입</h2>

        {/* 팀 이름 */}
        <div className={styles.inputGroup}>
          <label htmlFor="teamname">팀 이름(필수):</label>
          <input
            type="text"
            id="teamname"
            name="teamname"
            value={values.teamname}
            onChange={handleChange}
            required
            placeholder="팀의 고유 이름을 입력하세요."
          />
        </div>

        {/* 지역 */}
        <div className={styles.inputGroup}>
          <label htmlFor="region">활동 지역(필수):</label>
          <input
            type="text"
            id="region"
            name="region"
            value={values.region}
            onChange={handleChange}
            required
            placeholder="예: 서울 강남구"
          />
        </div>

        {/* 멤버 수 (선택) */}
        <div className={styles.inputGroup}>
          <label>팀 인원:</label>
          <div className={styles.buttonGroup}>
            {MEMBER_COUNTS.map(count => (
              <button
                key={count}
                type="button"
                onClick={() => handleSelect('membercount', count)}
                className={values.membercount === count ? styles.buttonSelected : styles.button}
              >
                {count}명
              </button>
            ))}
          </div>
        </div>

        {/* 활동 요일 (선택) */}
        <div className={styles.inputGroup}>
          <label>주요 활동 요일(필수):</label>
          <div className={styles.buttonGroup}>
            {DAYS.map(day => (
              <button
                key={day}
                type="button"
                onClick={() => handleSelect('activityday', day)}
                className={values.activityday === day ? styles.buttonSelected : styles.button}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* 이메일 (로그인용) */}
        <div className={styles.inputGroup}>
          <label htmlFor="email">이메일(대표이메일):</label>
          <input
            type="email"
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            required
            placeholder="login@team.com"
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

        {/* 팀 소개 (Textarea) */}
        <div className={styles.inputGroup}>
          <label htmlFor="introduction">팀 소개:</label>
          <textarea
            id="introduction"
            name="introduction"
            value={values.introduction}
            onChange={handleChange as unknown as React.ChangeEventHandler<HTMLTextAreaElement>} // Type Assertion 필요
            rows={4}
            placeholder="팀의 특징, 목표 등을 간략히 소개해주세요."
          />
        </div>

        {/* 연락처 */}
        <div className={styles.inputGroup}>
          <label htmlFor="contact">비상 연락망:</label>
          <input
            type="text"
            id="contact"
            name="contact"
            value={values.contact}
            onChange={handleChange}
            placeholder="대표 휴대폰 번호"
          />
        </div>

        {/* 레벨 (선택) */}
        <div className={styles.inputGroup}>
          <label>실력 레벨 (1:초보 ~ 5:전문가):</label>
          <div className={styles.buttonGroup}>
            {LEVELS.map(level => (
              <button
                key={level}
                type="button"
                onClick={() => handleSelect('level', level)}
                className={values.level === level ? styles.buttonSelected : styles.button}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {error && <p className={styles.errorMsg}>🚨 {error}</p>}
        {successMessage && <p className={styles.successMsg}>✅ {successMessage}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? '가입 요청 중...' : '팀 가입하기'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;