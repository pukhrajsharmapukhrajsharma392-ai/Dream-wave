import { useState, useContext } from 'react';
import { X, UploadCloud, FileAudio } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import './Modal.css';

const UploadAlbumModal = ({ onClose }) => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({ title: '', artist: '', description: '', releaseYear: new Date().getFullYear() });
  const [audioFiles, setAudioFiles] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: '', success: false, progress: '' });

  const handleAudioFiles = (e) => {
    // Convert FileList to Array
    setAudioFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setStatus({ ...status, error: 'You must be logged in to upload an album.' });
      return;
    }
    if (audioFiles.length === 0) {
      setStatus({ ...status, error: 'At least one audio file is required for an album.' });
      return;
    }

    setStatus({ loading: true, error: '', success: false, progress: 'Requesting upload...' });
    
    try {
      const audioFilenames = audioFiles.map(f => f.name);

      // 1. Request Signed Upload URLs and Create DB Record
      const requestRes = await axios.post('/api/albums/request-upload', {
        title: formData.title,
        artist: formData.artist,
        description: formData.description,
        releaseYear: formData.releaseYear,
        audioFilenames,
        coverFilename: coverFile ? coverFile.name : null
      }, {
        headers: { 'Authorization': token }
      });

      const { audioUploads, coverUpload } = requestRes.data;

      // 2. Upload Cover directly to Supabase Storage if exists
      if (coverFile && coverUpload) {
        setStatus({ ...status, loading: true, progress: 'Uploading cover image...' });
        await fetch(coverUpload.signedUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${coverUpload.token}`,
            'Content-Type': coverFile.type
          },
          body: coverFile
        });
      }

      // 3. Upload all Audio files in parallel
      setStatus({ ...status, loading: true, progress: `Uploading ${audioFiles.length} songs...` });
      
      const uploadPromises = audioFiles.map((file) => {
        const uploadData = audioUploads.find(u => u.filename === file.name)?.uploadData;
        if (!uploadData) return Promise.resolve(); // Skip if no signed URL found

        return fetch(uploadData.signedUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${uploadData.token}`,
            'Content-Type': file.type
          },
          body: file
        });
      });

      await Promise.all(uploadPromises);

      setStatus({ loading: false, error: '', success: true, progress: 'Album uploaded successfully!' });
      setTimeout(onClose, 2000);
    } catch (err) {
      console.error(err);
      setStatus({ loading: false, error: err.response?.data?.error || err.message, success: false, progress: '' });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass" style={{ maxWidth: '500px' }}>
        <button className="modal-close" onClick={onClose}><X size={24} /></button>
        <h2 style={{marginBottom: '5px'}}>Upload Full Album</h2>
        <p className="text-sm text-muted" style={{marginBottom: '20px'}}>Upload multiple tracks into a single album.</p>
        
        {status.error && <p style={{color: '#ff4d4f', fontSize: '14px', marginBottom: '15px'}}>{status.error}</p>}
        {status.success && <p style={{color: '#10b981', fontSize: '14px', marginBottom: '15px'}}>{status.progress}</p>}
        {!status.error && !status.success && status.progress && <p style={{color: '#8B5CF6', fontSize: '14px', marginBottom: '15px'}}>{status.progress}</p>}
        
        <form onSubmit={handleSubmit} className="modal-form">
          <input 
            type="text" 
            placeholder="Album Title" 
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
          <div style={{ display: 'flex', gap: '10px' }}>
             <input 
              type="number" 
              placeholder="Release Year" 
              value={formData.releaseYear} 
              onChange={e => setFormData({...formData, releaseYear: e.target.value})}
              required 
            />
            <input 
              type="text" 
              placeholder="Description (Optional)" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              style={{ flex: 2 }}
            />
          </div>
          
          <div className="file-input-group">
            <label className="text-sm text-muted">Audio Files (Select multiple MP3/WAV)</label>
            <input 
              type="file" 
              accept="audio/*"
              multiple
              onChange={handleAudioFiles}
              required 
            />
            {audioFiles.length > 0 && <div style={{marginTop: '5px', fontSize: '12px', color: '#8B5CF6'}}><FileAudio size={12} style={{display:'inline', marginRight:'4px'}}/>{audioFiles.length} tracks selected</div>}
          </div>

          <div className="file-input-group">
            <label className="text-sm text-muted">Album Cover Image (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setCoverFile(e.target.files[0])}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}} disabled={status.loading}>
            {status.loading ? 'Uploading...' : <><UploadCloud size={18} style={{marginRight: '8px'}}/> Upload Album</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadAlbumModal;
