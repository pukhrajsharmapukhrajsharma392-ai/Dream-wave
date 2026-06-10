const express = require("express");
const supabase = require("../lib/supabase");

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const user = data.user;
    if (user) {
      // Auto-confirm the user's email to bypass email verification issues
      try {
        await supabase.auth.admin.updateUserById(user.id, { email_confirm: true });
      } catch (adminErr) {
        console.error("Error auto-confirming email:", adminErr);
      }

      // Insert into our custom public.users table for profile info
      const { error: insertError } = await supabase.from('users').insert({
        id: user.id,
        username: username,
        avatar: ''
      });
      if (insertError) {
        console.error("Error creating public user profile:", insertError);
      }
    }

    res.json({
      token: data.session?.access_token || 'no_session_yet',
      user: { id: user?.id, username, email }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const user = data.user;
    res.json({
      token: data.session.access_token,
      user: { id: user.id, username: user.user_metadata?.username || 'User', email: user.email }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get current user details
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    // Optionally fetch public profile from users table
    const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).single();

    res.json({
      id: data.user.id,
      username: data.user.user_metadata?.username || profile?.username,
      email: data.user.email,
      avatar: profile?.avatar
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Request Password Reset OTP
router.post("/reset-password", async (req, res) => {
  try {
    const { email } = req.body;
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    res.json({ message: "OTP sent to email successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Verify OTP and Update Password
router.post("/verify-reset", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // 1. Verify OTP
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'recovery'
    });

    if (error || !data.user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 2. Use the admin API to securely update the user's password using their confirmed ID
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      data.user.id,
      { password: newPassword }
    );

    if (updateError) {
      return res.status(400).json({ message: updateError.message });
    }

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
