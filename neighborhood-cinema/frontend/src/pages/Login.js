import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isRegister) {
      const result = await register(formData.username, formData.email, formData.password, formData.role);
      if (!result.success) setError(result.msg);
      else navigate('/');
    } else {
      const result = await login(formData.email, formData.password);
      if (!result.success) setError(result.msg);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4">
            <h2 className="text-center">{isRegister ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
              {isRegister && (
                <input
                  className="form-control mb-3"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              )}
              <input
                className="form-control mb-3"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <input
                className="form-control mb-3"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
              {isRegister && (
                <select
                  className="form-control mb-3"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              )}
              {error && <div className="alert alert-danger">{error}</div>}
              <button type="submit" className="btn btn-primary w-100">{isRegister ? 'Register' : 'Login'}</button>
            </form>
            <p className="text-center mt-3">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
              <Link to="#" onClick={() => setIsRegister(!isRegister)} className="ms-2">
                {isRegister ? 'Login' : 'Register'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
