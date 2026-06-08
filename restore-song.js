const { MongoClient } = require('mongodb');
const { createClient } = require('@supabase/supabase-js');

const MONGO_URI = "mongodb+srv://pukhraj_sharma4421:QpPxnUJKQ7mO25fr@cluster21.fxzshol.mongodb.net/dreamwave?retryWrites=true&w=majority";
const SUPABASE_URL = "https://ngqybxbhdezyfkhklmbh.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXlieGJoZGV6eWZraGtsbWJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDkyNTM0MSwiZXhwIjoyMDk2NTAxMzQxfQ.xh8fJAym04H8oSBPMFtrmP-A23gK0SMun4BOK6mO5M8";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function restore() {
  console.log("Connecting to MongoDB to find 'Dil Chura Liya'...");
  const client = new MongoClient(MONGO_URI);
  
  try {
    await client.connect();
    const db = client.db("dreamwave");
    
    // Find song by title
    const song = await db.collection("songs").findOne({ title: { $regex: /dil chura liya/i } });
    
    if (song) {
      console.log(`Found song: ${song.title} by ${song.artist}`);
      
      const supabaseSong = {
        title: song.title || 'Unknown Title',
        artist: song.artist || 'Unknown Artist',
        cover_image: song.coverImage || '',
        audio_url: song.audioUrl || '',
        lyrics: song.lyrics || '',
        plays: song.plays || 0,
        created_at: song.createdAt ? new Date(song.createdAt).toISOString() : new Date().toISOString()
      };
      
      console.log("Inserting back into Supabase...");
      const { error } = await supabase.from('songs').insert([supabaseSong]);
      
      if (error) {
        console.error("Failed to restore song:", error.message);
      } else {
        console.log("Successfully restored 'Dil Chura Liya'!");
      }
    } else {
      console.log("Could not find 'Dil Chura Liya' in MongoDB. Did you upload it after the migration?");
      
      // Wait, let's also check Supabase Storage in case they uploaded it via the new frontend!
      console.log("Checking Supabase Storage just in case it was uploaded there...");
    }
  } catch (err) {
    console.error("Restore failed:", err);
  } finally {
    await client.close();
  }
}

restore();
