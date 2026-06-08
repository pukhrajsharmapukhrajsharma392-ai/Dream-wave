const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas.");
    
    // Define schema
    const SongSchema = new mongoose.Schema({
      title: String,
      artist: String,
      audioUrl: String,
      coverImage: String,
      plays: { type: Number, default: 0 }
    }, { timestamps: true });

    const Song = mongoose.models.Song || mongoose.model("Song", SongSchema);

    const songs = await Song.find({});
    console.log("All songs in DB:");
    songs.forEach(s => console.log(`- ${s.title} by ${s.artist} (Audio: ${s.audioUrl ? "Yes" : "No"}, Cover: ${s.coverImage ? "Yes" : "No"}) [ID: ${s._id}]`));

    // Remove songs with empty audio or cover
    const result = await Song.deleteMany({ 
      $or: [
        { audioUrl: { $in: ["", null] } },
        { title: { $in: ["", null, "Unknown Title"] } }
      ]
    });
    
    console.log(`\nDeleted ${result.deletedCount} empty/invalid songs.`);
    process.exit(0);
  } catch (err) {
    console.error("MongoDB error:", err);
    process.exit(1);
  }
};

connectDB();
