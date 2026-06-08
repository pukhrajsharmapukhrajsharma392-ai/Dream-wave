import { useState, useContext } from 'react';
import { X, UploadCloud } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import './Modal.css';

const UploadModal = ({ onClose }) => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({ title: '', artist: '' });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: '', success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setStatus({ ...status, error: 'You must be logged in to upload music.' });
      return;
    }
    if (!audioFile) {
      setStatus({ ...status, error: 'Audio file is required.' });
      return;
    }

    setStatus({ loading: true, error: '', success: false });
    
    try {
      // 1. Request Signed Upload URLs and Create DB Record
      const requestRes = await axios.post('/api/songs/request-upload', {
        title: formData.title,
        artist: formData.artist,
        audioFilename: audioFile.name,
        coverFilename: coverFile ? coverFile.name : null
      }, {
        headers: { 'Authorization': token }
      });

      const { audioUpload, coverUpload } = requestRes.data;

      // 2. Upload Audio directly to Supabase Storage
      await fetch(audioUpload.signedUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${audioUpload.token}`,
          'Content-Type': audioFile.type
        },
        body: audioFile
      });

      // 3. Upload Cover directly to Supabase Storage if exists
      if (coverFile && coverUpload) {
        await fetch(coverUpload.signedUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${coverUpload.token}`,
            'Content-Type': coverFile.type
          },
          body: coverFile
        });
      }

      setStatus({ loading: false, error: '', success: true });
      setTimeout(onClose, 2000);
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, error: err.response?.data?.error || err.message, success: false });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass">
        <button className="modal-close" onClick={onClose}><X size={24} /></button>
        <h2 style={{marginBottom: '5px'}}>Upload Music</h2>
        <p className="text-sm text-muted" style={{marginBottom: '20px'}}>Share your tracks with the world.</p>
        
        {status.error && <p style={{color: '#ff4d4f', fontSize: '14px', marginBottom: '15px'}}>{status.error}</p>}
        {status.success && <p style={{color: '#10b981', fontSize: '14px', marginBottom: '15px'}}>Upload successful!</p>}
        
        <form onSubmit={handleSubmit} className="modal-form">
          <input 
            type="text" 
            placeholder="Song Title" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})}
            required 
          />
          <input 
            type="text" 
            placeholder="Artist Name" 
            value={formData.artist} 
            onChange={e => setFormData({...formData, artist: e.target.value})}
            required 
          />
          
          <div className="file-input-group">
            <label className="text-sm text-muted">Audio File (MP3/WAV)</label>
            <input 
              type="file" 
              accept="audio/*"
              onChange={e => setAudioFile(e.target.files[0])}
              required 
            />
          </div>

          <div className="file-input-group">
            <label className="text-sm text-muted">Cover Image (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setCoverFile(e.target.files[0])}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}} disabled={status.loading}>
            {status.loading ? 'Uploading...' : <><UploadCloud size={18} style={{marginRight: '8px'}}/> Upload Track</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
