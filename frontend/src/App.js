import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminUserListPage from './pages/AdminUserListPage';
import AdminRoute from './routes/AdminRoute';
import CreateTicketPage from './pages/CreateTicketPage';
import MyTicketListPage from './pages/MyTicketListPage';
import TicketDetailPage from './pages/TicketDetailPage';
import AdminTicketListPage from './pages/AdminTicketListPage';
import AdminTicketDetailPage from './pages/AdminTicketDetailPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/users" element={
        <AdminRoute>
          <AdminUserListPage />
        </AdminRoute>
      } />
      <Route path="/my-tickets/create" element={<CreateTicketPage />} />
      <Route path="/my-tickets" element={<MyTicketListPage />} />
      <Route path="/my-tickets/:id" element={<TicketDetailPage />} />
      <Route path="/admin/tickets" element={
        <AdminRoute>
          <AdminTicketListPage />
        </AdminRoute>
      } />
      <Route path="/admin/tickets/:id" element={
        <AdminRoute>
          <AdminTicketDetailPage />
        </AdminRoute>
      } />
    </Routes>
  </BrowserRouter>
);

export default App;
