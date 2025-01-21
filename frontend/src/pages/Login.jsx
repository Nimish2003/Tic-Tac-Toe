import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Api from '../api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await Api.loginUser({ username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);
      toast.success('Login Successful!', { autoClose: 1500, theme: "colored" });
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login Failed', { autoClose: 1500, theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-400">Username</label>
            <input
              type="text"
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-400">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 mt-4 bg-gradient-to-r from-orange-700 to-pink-500 text-white font-semibold rounded-full hover:opacity-90 transition"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          Don't have an account? 
          <span className="text-orange-400 cursor-pointer" onClick={() => navigate('/register')}> Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
