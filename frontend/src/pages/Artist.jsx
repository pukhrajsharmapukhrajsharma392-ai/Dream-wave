import { Play, Heart, MoreHorizontal } from 'lucide-react';
import { useParams } from 'react-router-dom';

const Artist = () => {
  const { id } = useParams();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="glass" style={{ height: '300px', borderRadius: '16px', padding: '40px', display: 'flex', alignItems: 'flex-end', background: 'linear-gradient(to top, rgba(8,8,8,1), rgba(8,8,8,0)), linear-gradient(135deg, #8B5CF6, #06B6D4)' }}>
        <div>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>Diljit Dosanjh</h1>
          <p className="text-muted">22,450,980 monthly listeners</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '1.1rem' }}><Play fill="currentColor" size={20} style={{marginRight: '8px', verticalAlign: 'middle'}}/> Play</button>
        <button className="btn glass">Follow</button>
        <button className="btn-icon"><MoreHorizontal size={24}/></button>
      </div>

      <div>
        <h2 className="text-xl" style={{ marginBottom: '20px' }}>Popular</h2>
        {[1,2,3,4,5].map(i => (
          <div key={i} className="glass" style={{ display: 'flex', alignItems: 'center', padding: '12px 24px', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer' }}>
            <span className="text-muted" style={{ width: '30px' }}>{i}</span>
            <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '4px', marginRight: '16px' }}></div>
            <div style={{ flex: 1 }}>
              <h4 className="text-sm" style={{ margin: 0 }}>Get Lucky</h4>
            </div>
            <span className="text-muted text-sm">4:08</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Artist;
