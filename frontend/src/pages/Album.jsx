import { Play, Heart, Clock, MoreHorizontal } from 'lucide-react';

const Album = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-end' }}>
        <div className="glass" style={{ width: '250px', height: '250px', borderRadius: '12px', background: 'linear-gradient(45deg, #4c1d95, #0891b2)', backgroundImage: 'url(https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b1/33/44/b133441f-6cb5-d3ba-852c-72608c316900/5026854097978.jpg/600x600bb.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}></div>
        <div>
          <p className="text-xs text-muted">ALBUM</p>
          <h1 style={{ fontSize: '3rem', margin: '8px 0' }}>G.O.A.T.</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#fff' }}></div>
            <span className="text-sm font-semibold">Diljit Dosanjh</span>
            <span className="text-muted text-sm">• 2020 • 16 songs, 50 min</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button className="btn btn-primary" style={{ width: '56px', height: '56px', borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justify: 'center' }}><Play fill="currentColor" size={28} style={{marginLeft: '4px'}}/></button>
        <button className="btn-icon"><Heart size={28}/></button>
        <button className="btn-icon"><MoreHorizontal size={24}/></button>
      </div>

      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', padding: '0 24px 8px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px', color: 'var(--text-muted)' }} className="text-sm">
          <span style={{ width: '40px' }}>#</span>
          <span style={{ flex: 1 }}>Title</span>
          <span><Clock size={16}/></span>
        </div>
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className="glass" style={{ display: 'flex', alignItems: 'center', padding: '12px 24px', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer' }}>
            <span className="text-muted" style={{ width: '40px' }}>{i}</span>
            <div style={{ flex: 1 }}>
              <h4 className="text-sm" style={{ margin: 0, fontWeight: 500 }}>Track {i}</h4>
              <p className="text-xs text-muted" style={{ margin: 0, marginTop: '4px' }}>Daft Punk</p>
            </div>
            <span className="text-muted text-sm">3:45</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Album;
