const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ngqybxbhdezyfkhklmbh.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXlieGJoZGV6eWZraGtsbWJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDkyNTM0MSwiZXhwIjoyMDk2NTAxMzQxfQ.xh8fJAym04H8oSBPMFtrmP-A23gK0SMun4BOK6mO5M8";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function clearSongs() {
  console.log("Removing all songs from Supabase...");
  const { data, error } = await supabase.from('songs').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything
  
  if (error) {
    console.error("Error deleting songs:", error.message);
  } else {
    console.log("Successfully removed all songs!");
  }
}

clearSongs();
