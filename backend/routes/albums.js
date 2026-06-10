const express = require("express");
const supabase = require("../lib/supabase");

const router = express.Router();

// Get all albums
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from('albums').select('*, songs(*)').order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Request Signed Upload URLs and Create Album + Songs DB Records
router.post("/request-upload", async (req, res) => {
  try {
    const { title, artist, description, releaseYear, coverFilename, audioFilenames } = req.body;
    
    if (!audioFilenames || audioFilenames.length === 0) {
      return res.status(400).json({ error: "At least one audio file is required for an album." });
    }

    const timestamp = Date.now();
    const SUPABASE_STORAGE_URL = `${process.env.SUPABASE_URL}/storage/v1/object/public/dream-wave`;

    // 1. Prepare Cover Path & URL
    let coverPath = null;
    let coverPublicUrl = '';
    if (coverFilename) {
      const cleanCoverName = coverFilename.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-]/g, '');
      coverPath = `covers/albums/${timestamp}-${cleanCoverName}`;
      coverPublicUrl = `${SUPABASE_STORAGE_URL}/${coverPath}`;
    }

    // 2. Create Album Record in DB
    const newAlbum = {
      title: title || "Unknown Album",
      artist: artist || "Unknown Artist",
      description: description || "",
      release_year: releaseYear ? parseInt(releaseYear) : new Date().getFullYear(),
      cover_image: coverPublicUrl
    };

    const { data: albumData, error: albumError } = await supabase.from('albums').insert([newAlbum]).select().single();
    if (albumError) throw albumError;

    // 3. Prepare Audio Paths & URLs
    const audioUploadRequests = [];
    const newSongs = [];

    for (let i = 0; i < audioFilenames.length; i++) {
      const filename = audioFilenames[i];
      // Try to extract song title from filename (removing extension)
      const songTitle = filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ') || `Track ${i + 1}`;
      
      const cleanAudioName = filename.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-]/g, '');
      const audioPath = `audio/albums/${albumData.id}/${timestamp}-${cleanAudioName}`;
      const audioPublicUrl = `${SUPABASE_STORAGE_URL}/${audioPath}`;

      newSongs.push({
        title: songTitle,
        artist: artist || "Unknown Artist",
        cover_image: coverPublicUrl,
        audio_url: audioPublicUrl,
        album_id: albumData.id,
        plays: 0
      });

      audioUploadRequests.push({ path: audioPath, filename });
    }

    // 4. Create Songs Records in DB
    const { error: songsError } = await supabase.from('songs').insert(newSongs);
    if (songsError) throw songsError;

    // 5. Generate Signed URLs for Storage
    let coverUploadData = null;
    if (coverPath) {
      const { data, error } = await supabase.storage.from('dream-wave').createSignedUploadUrl(coverPath);
      if (error) throw error;
      coverUploadData = data;
    }

    const audioUploads = [];
    for (const req of audioUploadRequests) {
      const { data, error } = await supabase.storage.from('dream-wave').createSignedUploadUrl(req.path);
      if (error) throw error;
      audioUploads.push({ filename: req.filename, uploadData: data });
    }

    res.json({
      album: albumData,
      coverUpload: coverUploadData,
      audioUploads: audioUploads
    });
  } catch (err) {
    console.error("Album Upload Request Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
