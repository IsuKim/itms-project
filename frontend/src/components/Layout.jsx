import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';

const Layout = () => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div>
      <nav style={{ background: '#eee', padding: '10px' }}>
        {role === 'admin' ? (
          <>
            <Link to="/admin/tickets">📋 티켓 관리</Link> |{" "}
            <Link to="/admin/users">👥 사용자</Link> |{" "}
            <Link to="/admin/dashboard">📊 대시보드</Link>
          </>
        ) : (
          <>
            <Link to="/my-tickets">🏠 내 티켓</Link> |{" "}
            <Link to="/my-tickets/create">➕ 티켓 작성</Link> |{" "}
            <Link to="/profile">👤 내 정보</Link>
          </>
        )}
        <span style={{ float: 'right' }}>
          <button onClick={handleLogout}>🚪 로그아웃</button>
        </span>
      </nav>

      {/* ❗ 중첩 라우터 표시되는 위치 */}
      <div style={{ padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
