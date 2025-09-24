import React from 'react';
import { useAuth } from '../AuthContext';
import AdminDashboard from '../components/AdminDashboard';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return <AdminDashboard />;
};

export default Admin;
