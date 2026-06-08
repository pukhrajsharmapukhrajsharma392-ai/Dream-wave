import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import './AuthPages.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);

    try {
      await axios.post('/api/auth/reset-password', { email });
      setMsg('A 6-digit OTP has been sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Ensure the email is registered.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await axios.post('/api/auth/verify-reset', { email, otp, newPassword });
      setMsg('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container glass">
        <div className="auth-header">
          <img src="/logo.png" alt="Dream Wave Logo" className="auth-logo" />
          <h2>Reset Password</h2>
          <p className="text-muted">Recover your Dream Wave account</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        {msg && <div className="auth-success">{msg}</div>}
        
        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="auth-form">
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter your registered email"
              />
            </div>
            
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <Loader2 className="spin" size={20} /> : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <div className="input-group">
              <label>6-Digit OTP</label>
              <input 
                type="text" 
                required 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                placeholder="Enter the code from your email"
                maxLength={6}
              />
            </div>
            <div className="input-group">
              <label>New Password</label>
              <input 
                type="password" 
                required 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                placeholder="Enter a new password"
              />
            </div>
            
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <Loader2 className="spin" size={20} /> : 'Update Password'}
            </button>
          </form>
        )}
        
        <p className="auth-footer text-muted">
          Remembered your password? <Link to="/login" className="auth-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
