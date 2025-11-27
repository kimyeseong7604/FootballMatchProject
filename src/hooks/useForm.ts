import { useState } from 'react';
import type { ChangeEvent } from 'react'; 

// T는 폼 데이터의 타입
export function useForm<T>(initialState: T) {
  const [values, setValues] = useState<T>(initialState);

  // input과 textarea 모두를 처리할 수 있도록 타입 확장
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setValues(initialState);
  };

  return {
    values,
    handleChange,
    resetForm,
    setValues,
  };
}