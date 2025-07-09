import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [formData, setFormData] = useState({ name: '', party: '', age: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState(null); // <-- Admin state

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/candidate`);
      setCandidates(res.data);
    } catch (err) {
      console.error('Failed to fetch candidates:', err);
    }
  };

  const fetchAdminProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.user.role !== 'admin') {
        toast.error('Unauthorized access');
        navigate('/');
        return;
      }

      setAdmin(res.data.user);
    } catch (err) {
      toast.error('Failed to fetch admin profile');
      console.error(err);
      navigate('/');
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchAdminProfile(); // <-- Fetch profile on load
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/candidate/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/candidate`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormData({ name: '', party: '', age: '' });
      setEditId(null);
      fetchCandidates();
    } catch (err) {
      alert(err.response?.data?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return;

    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/candidate/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCandidates();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleEdit = (candidate) => {
    setFormData({ name: candidate.name, party: candidate.party, age: candidate.age });
    setEditId(candidate._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      localStorage.removeItem('token');
      toast.success('✅ Logged out successfully!');
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Admin Profile */}
        {admin && (
          <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Welcome, {admin.name}</h2>
              <p className="text-sm text-gray-500">{admin.aadharCardNumber}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        )}

        {/* Candidate Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
          <h3 className="text-xl font-semibold text-green-700">
            {editId ? 'Update Candidate' : 'Add New Candidate'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="p-3 border rounded w-full"
            />
            <input
              type="text"
              placeholder="Party"
              value={formData.party}
              onChange={(e) => setFormData({ ...formData, party: e.target.value })}
              required
              className="p-3 border rounded w-full"
            />
            <input
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              required
              className="p-3 border rounded w-full"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : editId ? 'Update' : 'Add'}
            </button>
          </div>
        </form>

        {/* Candidates Table */}
        <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4 text-green-700">Candidates</h3>
          <table className="w-full table-auto border text-sm">
            <thead className="bg-green-100 text-gray-700">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Party</th>
                <th className="p-2 border">Age</th>
                <th className="p-2 border">Votes</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c._id} className="hover:bg-gray-100">
                  <td className="p-2 border">{c.name}</td>
                  <td className="p-2 border">{c.party}</td>
                  <td className="p-2 border">{c.age}</td>
                  <td className="p-2 border">{c.voteCount}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {candidates.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    No candidates found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={1000} />
    </div>
  );
};

export default AdminDashboard;
