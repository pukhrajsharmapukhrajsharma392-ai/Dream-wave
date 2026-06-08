import { useState, useContext } from 'react';
import { X } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import './Modal.css';

const AuthModal = ({ onClose }) => {
  const { login, register } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    let success = false;
    
    if (isLogin) {
      success = await login(formData.email, formData.password);
    } else {
      success = await register(formData.username, formData.email, formData.password);
    }
    
    if (success) {
      onClose();
    } else {
      setError('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass">
        <button className="modal-close" onClick={onClose}><X size={24} /></button>
        <h2 style={{marginBottom: '20px'}}>{isLogin ? 'Welcome Back' : 'Join Dream Wave'}</h2>
        
        {error && <p style={{color: '#ff4d4f', fontSize: '14px', marginBottom: '15px'}}>{error}</p>}
        
        <form onSubmit={handleSubmit} className="modal-form">
          {!isLogin && (
            <input 
              type="text" 
              placeholder="Username" 
              value={formData.username} 
              onChange={e => setFormData({...formData, username: e.target.value})}
              required 
            />
          )}
          <input 
            type="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={e => setFormData({...formData, password: e.target.value})}
            required 
          />
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-sm text-muted" style={{marginTop: '20px', textAlign: 'center'}}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            style={{color: '#8B5CF6', cursor: 'pointer', fontWeight: 'bold'}} 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
