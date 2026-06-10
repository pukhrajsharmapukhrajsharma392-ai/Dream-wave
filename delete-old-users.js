require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://ngqybxbhdezyfkhklmbh.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXlieGJoZGV6eWZraGtsbWJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDkyNTM0MSwiZXhwIjoyMDk2NTAxMzQxfQ.xh8fJAym04H8oSBPMFtrmP-A23gK0SMun4BOK6mO5M8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ownerEmail = 'pukhrajsharmapukhrajsharma392@gmail.com';

async function deleteOldUsers() {
  console.log("Fetching users from Supabase Auth...");
  const { data, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error("Error fetching users:", error);
    return;
  }
  
  const users = data.users;
  console.log(`Found ${users.length} users in total.`);
  
  let deletedCount = 0;
  
  for (const user of users) {
    if (user.email === ownerEmail) {
      console.log(`Skipping owner account: ${user.email} (${user.id})`);
      continue;
    }
    
    console.log(`Deleting user: ${user.email} (${user.id})...`);
    
    // Delete from public.users table if exists
    await supabase.from('users').delete().eq('id', user.id);
    
    // Delete from Supabase Auth
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error(`Failed to delete user ${user.email}:`, deleteError);
    } else {
      console.log(`Successfully deleted user ${user.email}`);
      deletedCount++;
    }
  }
  
  console.log(`\nOperation complete. Deleted ${deletedCount} old user accounts.`);
}

deleteOldUsers();
