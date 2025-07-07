import React, { useState } from 'react';
import { login, getMe } from '../api/auth';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await login(form);
    const token = res.data.token;
    localStorage.setItem('token', token);

    const me = await getMe(token);
    localStorage.setItem('role', me.data.role);


    if (!me.data.is_approved) {
      setMessage('로그인 성공. (관리자 승인 대기 중)');
    } else {
      setMessage(`환영합니다, ${me.data.name}님!`);
    }

  } catch (err) {
    setMessage(err.response?.data?.message || '로그인 실패');
  }
};

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="이메일" onChange={handleChange} required />
        <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required />
        <button type="submit">로그인</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPage;
