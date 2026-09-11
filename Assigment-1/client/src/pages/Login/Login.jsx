import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login(username.trim());
      if (res.success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-title-area">
          <div className="login-badge">🛡️</div>
          <h2>Sign In to Portal</h2>
          <p>Enter your username to authenticate & access your dashboard</p>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="username-input">Username</label>
            <input
              id="username-input"
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Type username (e.g. User A or User B)"
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Authenticating & Saving...' : 'Sign In'}
          </button>
        </form>

        <div className="login-rule-footer">
          <p>
            <strong>Note:</strong> Type <em>User A</em> for full access (Orders + Billing) or <em>User B</em> for restricted access (Orders only, no Billing).
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

