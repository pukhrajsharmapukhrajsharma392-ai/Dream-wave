require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ngqybxbhdezyfkhklmbh.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXlieGJoZGV6eWZraGtsbWJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDkyNTM0MSwiZXhwIjoyMDk2NTAxMzQxfQ.xh8fJAym04H8oSBPMFtrmP-A23gK0SMun4BOK6mO5M8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createOwner() {
  console.log("Creating owner account...");
  const { data: user, error } = await supabase.auth.admin.createUser({
    email: 'pukhrajsharmapukhrajsharma392@gmail.com',
    password: 'Rahul@22',
    email_confirm: true,
    user_metadata: { username: 'pukhraj sharma', role: 'owner' }
  });

  if (error) {
    if (error.code === 'email_exists' || error.message.includes('already')) {
        console.log("Owner email already exists. Updating password and auto-confirming...");
        // If they already exist because of earlier attempts, update them
        
        // We first need the user ID. We can get it by listing users
        const { data: listData } = await supabase.auth.admin.listUsers();
        const existingUser = listData.users.find(u => u.email === 'pukhrajsharmapukhrajsharma392@gmail.com');
        
        if (existingUser) {
            const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
                existingUser.id,
                { password: 'Rahul@22', email_confirm: true, user_metadata: { username: 'pukhraj sharma', role: 'owner' } }
            );
            if (updateError) {
                console.error("Failed to update existing owner:", updateError);
            } else {
                console.log("Owner account successfully updated and confirmed!");
            }
        }
    } else {
        console.error("Failed to create owner:", error);
    }
  } else {
    console.log("Owner account successfully created and confirmed!");
  }
}

createOwner();
