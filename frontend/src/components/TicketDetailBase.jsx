import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTicketDetail, postReply, deleteTicketFile, deleteReplyFile } from '../api/ticket';

const isImageFile = (filename) => {
  return /\.(png|jpe?g|gif)$/i.test(filename);
};

const TicketDetailBase = ({ ticketId, token, role }) => {
  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);
  const [message, setMessage] = useState('');
  const [replyFiles, setReplyFiles] = useState([]);

  const fetchDetail = async () => {
    try {
      const res = await getTicketDetail(ticketId, token);
      setTicket(res.data.ticket);
      setReplies(res.data.replies);
    } catch {
      alert('티켓 불러오기 실패');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('message', message);
    replyFiles.forEach(file => formData.append('files', file));
    await postReply(ticketId, formData, token);
    setMessage('');
    setReplyFiles([]);
    fetchDetail();
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getTicketDetail(ticketId, token);
        setTicket(res.data.ticket);
        setReplies(res.data.replies);

        // ✅ 데이터 로드 성공 후에 읽음 처리
        await axios.post(`${process.env.REACT_APP_API_URL}/tickets/${ticketId}/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

      } catch (err) {
        alert('티켓 상세 조회 실패');
      }
    };

    fetchDetail();
  }, [ticketId]);

  if (!ticket) return <p>로딩 중...</p>;

  return (
    <div>
      <h2>티켓 상세</h2>
      <p><strong>제목:</strong> {ticket.title}</p>
      <p><strong>설명:</strong> {ticket.description}</p>
      <p><strong>긴급도:</strong> {ticket.urgency}</p>
      <p><strong>상태:</strong> {ticket.status}</p>

      {ticket.files && ticket.files.length > 0 && (
        <div>
          <h4>티켓 첨부파일</h4>
          <ul>
            {ticket.files.map(f => (
              <li key={f.filename}>
                {isImageFile(f.originalname) ? (
                  <img
                    src={`http://localhost:5000/uploads/${f.filename}`}
                    alt={f.originalname}
                    style={{ width: '120px', marginBottom: '6px', borderRadius: '4px' }}
                  />
                ) : (
                  <a
                    href={`http://localhost:5000/uploads/${f.filename}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    📎 {f.originalname}
                  </a>
                )}
                {role === 'admin' && (
                  <button onClick={() => {
                    if (window.confirm('삭제하시겠습니까?')) {
                      deleteTicketFile(f.filename, token).then(fetchDetail);
                    }
                  }}>❌</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3>댓글</h3>
      <ul>
        {replies.map(r => (
          <li key={r.id} style={{ marginBottom: '12px' }}>
            <strong>{r.author_name} ({r.role})</strong>: {r.message}
            <br /><small>{new Date(r.created_at).toLocaleString()}</small>
            {r.files && r.files.length > 0 && (
              <ul>
                {r.files.map(f => (
                  <li key={f.filename}>
                    {isImageFile(f.originalname) ? (
                      <img
                        src={`http://localhost:5000/uploads/${f.filename}`}
                        alt={f.originalname}
                        style={{ width: '100px', marginBottom: '4px', borderRadius: '4px' }}
                      />
                    ) : (
                      <a
                        href={`http://localhost:5000/uploads/${f.filename}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        📎 {f.originalname}
                      </a>
                    )}
                    {role === 'admin' && (
                      <button onClick={() => {
                        if (window.confirm('삭제하시겠습니까?')) {
                          deleteReplyFile(f.filename, token).then(fetchDetail);
                        }
                      }}>❌</button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="댓글 입력"
          required
        />
        <input type="file" multiple onChange={(e) => setReplyFiles(Array.from(e.target.files))} />
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default TicketDetailBase;
