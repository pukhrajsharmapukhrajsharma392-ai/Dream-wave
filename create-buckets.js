const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ngqybxbhdezyfkhklmbh.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXlieGJoZGV6eWZraGtsbWJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDkyNTM0MSwiZXhwIjoyMDk2NTAxMzQxfQ.xh8fJAym04H8oSBPMFtrmP-A23gK0SMun4BOK6mO5M8";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createBuckets() {
  console.log("Creating public bucket 'dream-wave'...");
  const { data, error } = await supabase.storage.createBucket('dream-wave', {
    public: true,
    fileSizeLimit: 52428800 // 50MB
  });
  
  if (error) {
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      console.log("Bucket already exists. Continuing...");
    } else {
      console.error("Error creating bucket:", error.message);
    }
  } else {
    console.log("Bucket 'dream-wave' created successfully!", data);
  }
}

createBuckets();
