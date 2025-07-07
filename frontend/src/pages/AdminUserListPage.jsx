import React, { useEffect, useState } from 'react';
import { getAllUsers, approveUser } from '../api/user';

const AdminUserListPage = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers(token);
      setUsers(res.data);
    } catch {
      alert('접근 권한이 없거나 오류 발생');
    }
  };

  const toggleApproval = async (id, current) => {
    try {
      await approveUser(id, !current, token);
      fetchUsers(); // 갱신
    } catch {
      alert('승인 처리 실패');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>고객 계정 관리</h2>
      <table border="1">
        <thead>
          <tr>
            <th>이메일</th>
            <th>이름</th>
            <th>회사</th>
            <th>권한</th>
            <th>승인</th>
            <th>조작</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>{u.company_name}</td>
              <td>{u.role}</td>
              <td>{u.is_approved ? '승인됨' : '대기 중'}</td>
              <td>
                {u.role !== 'admin' && (
                  <button onClick={() => toggleApproval(u.id, u.is_approved)}>
                    {u.is_approved ? '승인 취소' : '승인하기'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserListPage;
