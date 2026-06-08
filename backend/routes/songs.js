const express = require("express");
const supabase = require("../lib/supabase");

const router = express.Router();

// 1. Request Signed Upload URLs and Create Database Record
router.post("/request-upload", async (req, res) => {
  try {
    const { title, artist, audioFilename, coverFilename } = req.body;
    
    const timestamp = Date.now();
    const cleanAudioName = audioFilename.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-]/g, '');
    const audioPath = `audio/${timestamp}-${cleanAudioName}`;
    
    let coverPath = null;
    if (coverFilename) {
      const cleanCoverName = coverFilename.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-]/g, '');
      coverPath = `covers/${timestamp}-${cleanCoverName}`;
    }

    // Generate Signed Upload URLs
    const { data: audioUploadData, error: audioError } = await supabase.storage.from('dream-wave').createSignedUploadUrl(audioPath);
    if (audioError) throw audioError;

    let coverUploadData = null;
    if (coverPath) {
      const { data, error } = await supabase.storage.from('dream-wave').createSignedUploadUrl(coverPath);
      if (error) throw error;
      coverUploadData = data;
    }

    // Generate Public URLs for the Database
    const SUPABASE_STORAGE_URL = `${process.env.SUPABASE_URL}/storage/v1/object/public/dream-wave`;
    const audioPublicUrl = `${SUPABASE_STORAGE_URL}/${audioPath}`;
    const coverPublicUrl = coverPath ? `${SUPABASE_STORAGE_URL}/${coverPath}` : '';

    const newSong = {
      title: title || "Unknown Title",
      artist: artist || "Unknown Artist",
      audio_url: audioPublicUrl,
      cover_image: coverPublicUrl,
      plays: 0
    };
    
    // Insert into Database
    const { data: songData, error: dbError } = await supabase.from('songs').insert([newSong]).select().single();
    if (dbError) throw dbError;

    res.json({
      song: songData,
      audioUpload: audioUploadData,
      coverUpload: coverUploadData
    });
  } catch (err) {
    console.error("Upload Request Error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    
    // Map snake_case to camelCase for frontend
    const mappedSongs = data.map(song => ({
      ...song,
      coverImage: song.cover_image,
      audioUrl: song.audio_url,
      createdAt: song.created_at
    }));
    
    res.json(mappedSongs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/stream/:id", async (req, res) => {
  try {
    const { data: song, error } = await supabase.from('songs').select('*').eq('id', req.params.id).single();
    
    if (error || !song) return res.status(404).json({ message: "Song not found" });

    res.setHeader("Content-Type", "audio/mpeg");
    res.redirect(song.audio_url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
