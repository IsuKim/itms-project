import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../api/dashboard';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff6666'];

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats(token);;
        setStats(res.data);
      } catch {
        alert('통계 조회 실패');
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <p>로딩 중...</p>;

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff6666'];
  const pieData = [
    { name: '접수', value: Number(stats.접수) },
    { name: '진행중', value: Number(stats.진행중) },
    { name: '답변 완료', value: Number(stats.답변완료) },
    { name: '종결', value: Number(stats.종결) }
  ];

  return (
    <div>
      <h2>📊 관리자 대시보드</h2>
      <ul>
        <li>📥 접수 티켓: {stats.접수}</li>
        <li>🔧 진행중: {stats.진행중}</li>
        <li>✅ 답변 완료: {stats.답변완료}</li>
        <li>📁 종결: {stats.종결}</li>
        <li>📋 전체 티켓 수: {stats.전체티켓}</li>
        <li>🧍 고객 수: {stats.고객수}</li>
        <li>🧑‍💼 관리자 수: {stats.관리자수}</li>
      </ul>
        <h3>🎯 티켓 상태 분포</h3>
        <PieChart width={400} height={300}>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
    </div>
  );
};

export default AdminDashboardPage;
