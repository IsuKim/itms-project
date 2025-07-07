import React, { useState } from 'react';
import { createTicket } from '../api/ticket';

const CreateTicketPage = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    urgency: '',
    product: '',
  });
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicket(form, token);
      setMessage('티켓이 성공적으로 생성되었습니다.');
      setForm({ title: '', description: '', urgency: '', product: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || '티켓 생성 실패');
    }
  };

  return (
    <div>
      <h2>기술 지원 요청</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="제목" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="설명" value={form.description} onChange={handleChange} required />
        <select name="urgency" value={form.urgency} onChange={handleChange}>
          <option value="">긴급도 선택</option>
          <option value="낮음">낮음</option>
          <option value="보통">보통</option>
          <option value="높음">높음</option>
        </select>
        <input name="product" placeholder="관련 제품" value={form.product} onChange={handleChange} />
        <button type="submit">등록</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateTicketPage;
