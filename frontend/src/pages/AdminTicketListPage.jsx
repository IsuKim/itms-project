import React, { useEffect, useState } from 'react';
import { getAllTickets } from '../api/ticket';
import { Link } from 'react-router-dom';

const AdminTicketListPage = () => {
  const token = localStorage.getItem('token');
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({ status: '', urgency: '', keyword: '' });

  const fetch = async () => {
    try {
      const res = await getAllTickets(token, filters);
      setTickets(res.data);
    } catch {
      alert('불러오기 실패');
    }
  };

  useEffect(() => {
    fetch();
  }, [filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>전체 고객 티켓 관리</h2>
      <div>
        <input name="keyword" placeholder="제목 검색" onChange={handleChange} />
        <select name="status" onChange={handleChange}>
          <option value="">상태</option>
          <option value="접수">접수</option>
          <option value="진행중">진행중</option>
          <option value="답변 완료">답변 완료</option>
          <option value="종결">종결</option>
        </select>
        <select name="urgency" onChange={handleChange}>
          <option value="">긴급도</option>
          <option value="낮음">낮음</option>
          <option value="보통">보통</option>
          <option value="높음">높음</option>
        </select>
      </div>

      <table border="1">
        <thead>
          <tr>
            <th>제목</th>
            <th>상태</th>
            <th>긴급도</th>
            <th>고객</th>
            <th>회사</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td><Link to={`/admin/tickets/${ticket.id}`}>{ticket.title}</Link></td>
              <td>{ticket.status}</td>
              <td>{ticket.urgency}</td>
              <td>{ticket.customer_email}</td>
              <td>{ticket.company_name}</td>
              <td>{new Date(ticket.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTicketListPage;
