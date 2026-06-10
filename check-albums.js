require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkTable() {
  const { data, error } = await supabase.from('albums').select('id').limit(1);
  if (error) {
    console.log("Error or table does not exist:", error.message);
  } else {
    console.log("Table exists! Data:", data);
  }
}
checkTable();
