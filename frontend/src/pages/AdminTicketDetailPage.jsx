import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTicketDetail, postReply, updateTicketStatus } from '../api/ticket';

const AdminTicketDetailPage = () => {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [message, setMessage] = useState('');

  const fetchDetail = async () => {
    try {
      const res = await getTicketDetail(id, token);
      setTicket(res.data.ticket);
      setReplies(res.data.replies);
    } catch {
      alert('티켓 불러오기 실패');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await postReply(id, message, token);
    setMessage('');
    fetchDetail();
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTicketStatus(id, newStatus, token);
      fetchDetail(); // 상태 갱신
    } catch {
      alert('상태 변경 실패');
    }
  };


  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (!ticket) return <p>로딩 중...</p>;

  return (
    <div>
      <h2>티켓 상세 (관리자)</h2>
      <p><strong>제목:</strong> {ticket.title}</p>
      <p><strong>고객 설명:</strong> {ticket.description}</p>
      <p><strong>긴급도:</strong> {ticket.urgency}</p>
      <p> <strong>상태:</strong> {ticket.status}{' '}
        {ticket.status === '접수' && (
          <button onClick={() => handleStatusChange('진행중')}>진행중으로 변경</button>
        )}
        {ticket.status === '진행중' && (
          <button onClick={() => handleStatusChange('답변 완료')}>답변 완료로</button>
        )}
        {ticket.status === '답변 완료' && (
          <button onClick={() => handleStatusChange('종결')}>종결 처리</button>
      )}</p>

      <h3>대화 히스토리</h3>
      <ul>
        {replies.map(r => (
          <li key={r.id} style={{
            backgroundColor: r.role === 'admin' ? '#f0f0f0' : '#e6f7ff',
            marginBottom: '10px', padding: '10px'
          }}>
            <strong>{r.author_name} ({r.role})</strong>: {r.message}
            <br /><small>{new Date(r.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
        <br />
        <button type="submit">답변 등록</button>
      </form>
    </div>
  );
};

export default AdminTicketDetailPage;
