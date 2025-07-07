import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getTicketDetail, postReply } from '../api/ticket';

const TicketDetailPage = () => {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [message, setMessage] = useState('');
  
  const fetchDetail = async () => {
    const res = await getTicketDetail(id, token);
    setTicket(res.data.ticket);
    setReplies(res.data.replies);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await postReply(id, message, token);
    setMessage('');
    fetchDetail(); // 댓글 갱신
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (!ticket) return <p>로딩 중...</p>;

  return (
    <div>
      <h2>티켓 상세</h2>
      <button onClick={() => navigate('/my-tickets')}>← 목록으로 돌아가기</button>
      <p><strong>제목:</strong> {ticket.title}</p>
      <p><strong>설명:</strong> {ticket.description}</p>
      <p><strong>긴급도:</strong> {ticket.urgency}</p>
      <p><strong>상태:</strong> {ticket.status}</p>

      <h3>대화 내역</h3>
      <ul>
        {replies.map(r => (
            <li
            key={r.id}
            style={{
                backgroundColor: r.role === 'admin' ? '#f9f9f9' : '#e6f0ff',
                padding: '10px',
                marginBottom: '8px',
                borderLeft: r.role === 'admin' ? '5px solid gray' : '5px solid #007bff'
            }}
            >
            <div>
                <strong>{r.author_name} ({r.role})</strong>
                <small style={{ float: 'right' }}>{new Date(r.created_at).toLocaleString()}</small>
            </div>
            <div>{r.message}</div>
            </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="답변 입력..." required />
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default TicketDetailPage;
