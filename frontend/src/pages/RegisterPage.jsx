import React, { useState } from 'react';
import { register } from '../api/auth';

const RegisterPage = () => {
  const [form, setForm] = useState({ email: '', password: '', name: '', company: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      setMessage('회원가입 성공! 승인 후 로그인 가능합니다.');
    } catch (err) {
      setMessage(err.response?.data?.message || '회원가입 실패');
    }
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="이메일" onChange={handleChange} required />
        <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required />
        <input name="name" placeholder="이름" onChange={handleChange} required />
        <input name="company" placeholder="회사명" onChange={handleChange} required />
        <button type="submit">가입하기</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterPage;
