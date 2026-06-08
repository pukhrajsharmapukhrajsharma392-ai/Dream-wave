import { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './Modal.css';

const ProfileModal = ({ onClose }) => {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normally this would call an API to update the profile
    alert("Profile update functionality coming soon!");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 style={{marginBottom: '24px'}}>Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="Your username"
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '16px'}}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
