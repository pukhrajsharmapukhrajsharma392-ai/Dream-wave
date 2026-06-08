const { MongoClient } = require('mongodb');
const { createClient } = require('@supabase/supabase-js');

const MONGO_URI = "mongodb+srv://pukhraj_sharma4421:QpPxnUJKQ7mO25fr@cluster21.fxzshol.mongodb.net/dreamwave?retryWrites=true&w=majority";
const SUPABASE_URL = "https://ngqybxbhdezyfkhklmbh.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXlieGJoZGV6eWZraGtsbWJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDkyNTM0MSwiZXhwIjoyMDk2NTAxMzQxfQ.xh8fJAym04H8oSBPMFtrmP-A23gK0SMun4BOK6mO5M8";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function migrate() {
  console.log("Connecting to MongoDB...");
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    const db = client.db("dreamwave");
    
    // 1. Migrate Songs
    console.log("Fetching songs from MongoDB...");
    const songs = await db.collection("songs").find({}).toArray();
    console.log(`Found ${songs.length} songs.`);
    
    if (songs.length > 0) {
      console.log("Inserting songs into Supabase...");
      const supabaseSongs = songs.map(song => ({
        title: song.title || 'Unknown Title',
        artist: song.artist || 'Unknown Artist',
        cover_image: song.coverImage || '',
        audio_url: song.audioUrl || '',
        lyrics: song.lyrics || '',
        plays: song.plays || 0,
        created_at: song.createdAt ? new Date(song.createdAt).toISOString() : new Date().toISOString()
      }));
      
      const { error } = await supabase.from('songs').insert(supabaseSongs);
      if (error) {
        console.error("Failed to insert songs:", error.message);
      } else {
        console.log("Successfully migrated all songs to Supabase!");
      }
    }

    // 2. We skip users because Supabase Auth handles user passwords (we can't migrate bcrypt hashes easily)
    // Users will need to recreate their accounts or we could send a mass password reset.
    // The instructions say "Update authentication to Supabase Auth" which implies a clean slate for Auth.
    console.log("Note: User accounts are not migrated because password hashes are incompatible. Users must sign up again.");

  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.close();
    console.log("Migration script finished.");
  }
}

migrate();
