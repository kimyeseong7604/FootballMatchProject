import { useState } from 'react';
import type { ChangeEvent } from 'react'; 

// T는 폼 데이터의 타입
export function useForm<T>(initialState: T) {
  const [values, setValues] = useState<T>(initialState);

  // input과 textarea 모두를 처리할 수 있도록 타입 확장
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // membercount와 같은 number 타입 필드 처리를 위한 간단한 예외 처리
    let processedValue: string | number = value;
    if (name === 'membercount') {
        // membercount는 숫자이므로 문자열이 아닌 숫자로 저장 시도
        processedValue = parseInt(value, 10) || 0; 
    }

    setValues(prev => ({
      ...prev,
      [name]: processedValue,
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