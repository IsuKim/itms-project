import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  getTicketDetail,
  postReply,
  deleteTicketFile,
  deleteReplyFile
} from '../api/ticket';


//const token = localStorage.getItem('token');

const TicketDetailPage = () => {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyFiles, setReplyFiles] = useState([]);
  const handleReplyFileChange = (e) => {
    setReplyFiles(Array.from(e.target.files));
  };
  const [message, setMessage] = useState('');
  
  const fetchDetail = async () => {
    const res = await getTicketDetail(id, token);
    setTicket(res.data.ticket);
    setReplies(res.data.replies);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('message', message);
    replyFiles.forEach(file => formData.append('files', file));

    try {
      await postReply(id, formData, token);
      setMessage('');
      setReplyFiles([]);
      fetchDetail();
    } catch {
      alert('댓글 등록 실패');
    }
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
      {ticket.files && ticket.files.length > 0 && (
        <div>
          <h4>티켓 첨부파일</h4>
          <ul>
            {ticket.files.map(f => (
              <li key={f.filename}>
                <a href={`http://localhost:5000/uploads/${f.filename}`} target="_blank" rel="noreferrer">
                  📎 {f.originalname}
                </a>
                <button onClick={() => {
                  if (window.confirm('정말 삭제하시겠습니까?')) {
                    deleteTicketFile(f.filename, token).then(fetchDetail);
                  }
                }}>❌</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p><strong>긴급도:</strong> {ticket.urgency}</p>
      <p><strong>상태:</strong> {ticket.status}</p>

      <h3>대화 내역</h3>
      <ul>
        {replies.map(r => (
          <li key={r.id} style={{ padding: '10px', marginBottom: '10px', background: '#f9f9f9' }}>
            <strong>{r.author_name} ({r.role})</strong>: {r.message}
            <br /><small>{new Date(r.created_at).toLocaleString()}</small>

            {/* ✅ 파일 목록 표시 */}
            {r.files && r.files.length > 0 && (
              <ul>
                {r.files.map(f => (
                  <li key={f.filename}>
                    <a href={`http://localhost:5000/uploads/${f.filename}`} target="_blank" rel="noreferrer">
                      📎 {f.originalname}
                    </a>
                    <button onClick={() => {
                      if (window.confirm('삭제할까요?')) {
                        deleteReplyFile(f.filename, token).then(fetchDetail);
                      }
                    }}>❌</button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <input type="file" multiple onChange={handleReplyFileChange} />
      <form onSubmit={handleSubmit}>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="답변 입력..." required />
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default TicketDetailPage;
