import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const RoleProtectedRoute = ({ children, allowedRole }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRole(res.data.user.role); // ✅ FIXED HERE
      } catch (err) {
        console.error("Role check failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserRole();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/" />;
  if (role !== allowedRole) return <Navigate to="/" />;

  return children;
};

export default RoleProtectedRoute;
