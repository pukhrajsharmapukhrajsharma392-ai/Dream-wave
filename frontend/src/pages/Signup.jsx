import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import './AuthPages.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);
    
    // Validate proper details
    if (username.length < 3) {
      setError('Name must be at least 3 characters long.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    const result = await register(username, email, password);
    if (result.success) {
      if (result.needsVerification) {
        setMsg('Account created successfully! Please check your inbox for the verification email before logging in.');
        setLoading(false);
      } else {
        setMsg('Account created successfully!');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } else {
      setError(result.error || 'Failed to create account. Email may already be in use.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass">
        <div className="auth-header">
          <img src="/logo.png" alt="Dream Wave Logo" className="auth-logo" />
          <h2>Create Account</h2>
          <p className="text-muted">Join Dream Wave Music</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        {msg && <div className="auth-success">{msg}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              required 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter your name"
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email"
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Create a password (min 6 chars)"
            />
          </div>
          
          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? <Loader2 className="spin" size={20} /> : 'Sign Up'}
          </button>
        </form>
        
        <p className="auth-footer text-muted">
          Already have an account? <Link to="/login" className="auth-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
