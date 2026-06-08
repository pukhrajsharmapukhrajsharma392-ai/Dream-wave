const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ngqybxbhdezyfkhklmbh.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXlieGJoZGV6eWZraGtsbWJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDkyNTM0MSwiZXhwIjoyMDk2NTAxMzQxfQ.xh8fJAym04H8oSBPMFtrmP-A23gK0SMun4BOK6mO5M8";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function uploadAndSeed() {
  console.log("Starting Album Seed...");
  
  // Real working MP3 files for dummy playback
  const dummyAudio1 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
  const dummyAudio2 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";
  const dummyAudio3 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";
  const dummyAudio4 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3";
  const dummyAudio5 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3";

  // Upload Dil Chura Liya image
  let dilChuraCoverUrl = "";
  try {
    const fileData = fs.readFileSync('C:\\Users\\pukhr\\.gemini\\antigravity\\brain\\9b6a6373-f084-49b8-9183-c2ac050feb9e\\dil_chura_liya_1780935972988.png');
    const path = `covers/dil-chura-liya-${Date.now()}.png`;
    const { data, error } = await supabase.storage.from('dream-wave').upload(path, fileData, { contentType: 'image/png' });
    if (error) throw error;
    dilChuraCoverUrl = `${SUPABASE_URL}/storage/v1/object/public/dream-wave/${path}`;
    console.log("Uploaded Dil Chura Liya cover");
  } catch (err) {
    console.log("Failed to upload Dil Chura cover:", err.message);
  }

  // Upload AP Dhillon image
  let apDhillonCoverUrl = "";
  try {
    const fileData = fs.readFileSync('C:\\Users\\pukhr\\.gemini\\antigravity\\brain\\9b6a6373-f084-49b8-9183-c2ac050feb9e\\hiphop_album_1780936004718.png');
    const path = `covers/ap-dhillon-${Date.now()}.png`;
    const { data, error } = await supabase.storage.from('dream-wave').upload(path, fileData, { contentType: 'image/png' });
    if (error) throw error;
    apDhillonCoverUrl = `${SUPABASE_URL}/storage/v1/object/public/dream-wave/${path}`;
    console.log("Uploaded AP Dhillon cover");
  } catch (err) {
    console.log("Failed to upload AP Dhillon cover:", err.message);
  }

  const songs = [
    {
      title: "Dil Chura Liya",
      artist: "Pukhraj Sharma",
      cover_image: dilChuraCoverUrl,
      audio_url: dummyAudio1,
      plays: 999999, // Make it super trending
      created_at: new Date().toISOString()
    },
    {
      title: "Excuses",
      artist: "AP Dhillon, Gurinder Gill",
      cover_image: apDhillonCoverUrl,
      audio_url: dummyAudio2,
      plays: 850000,
      created_at: new Date().toISOString()
    },
    {
      title: "Brown Munde",
      artist: "AP Dhillon, Gurinder Gill, Shinda Kahlon",
      cover_image: apDhillonCoverUrl,
      audio_url: dummyAudio3,
      plays: 950000,
      created_at: new Date().toISOString()
    },
    {
      title: "Summer High",
      artist: "AP Dhillon",
      cover_image: apDhillonCoverUrl,
      audio_url: dummyAudio4,
      plays: 750000,
      created_at: new Date().toISOString()
    },
    {
      title: "Insane",
      artist: "AP Dhillon, Shinda Kahlon",
      cover_image: apDhillonCoverUrl,
      audio_url: dummyAudio5,
      plays: 650000,
      created_at: new Date().toISOString()
    }
  ];

  const { error } = await supabase.from('songs').insert(songs);
  if (error) {
    console.error("Failed to insert songs:", error.message);
  } else {
    console.log("Successfully seeded Dil Chura Liya & AP Dhillon Album!");
  }
}

uploadAndSeed();
