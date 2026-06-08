const express = require("express");
const supabase = require("../lib/supabase");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from('playlists').select('*, songs:playlist_songs(song_id)');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create playlist (requires token)
router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    const { data: user, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user?.user) return res.status(401).json({ message: "Token is not valid" });

    const { name, songs } = req.body;
    
    // Insert playlist
    const { data: playlist, error } = await supabase.from('playlists').insert([{
      name,
      owner_id: user.user.id
    }]).select().single();
    
    if (error) throw error;

    // Insert songs into junction table if provided
    if (songs && songs.length > 0) {
      const playlistSongs = songs.map(songId => ({
        playlist_id: playlist.id,
        song_id: songId
      }));
      await supabase.from('playlist_songs').insert(playlistSongs);
    }

    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
