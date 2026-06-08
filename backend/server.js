const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/songs", require("./routes/songs"));
app.use("/api/playlists", require("./routes/playlists"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
