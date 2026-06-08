const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Connect to Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Connect to MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas.");
  } catch (err) {
    console.error("MongoDB error:", err);
    process.exit(1);
  }
};

const SongSchema = new mongoose.Schema({
  title: String,
  artist: String,
  audioUrl: String,
  coverImage: String,
  plays: { type: Number, default: 0 }
}, { timestamps: true });

// Prevent model overwrite if it exists
const Song = mongoose.models.Song || mongoose.model("Song", SongSchema);

const seedDatabase = async () => {
  await connectDB();
  
  try {
    console.log("Uploading cover image to Cloudinary...");
    const coverResult = await cloudinary.uploader.upload("https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b1/33/44/b133441f-6cb5-d3ba-852c-72608c316900/5026854097978.jpg/600x600bb.jpg", {
      folder: "dream-wave/covers",
      resource_type: "image"
    });
    console.log("Cover uploaded:", coverResult.secure_url);
    
    console.log("Uploading MP3 to Cloudinary (this might take a minute)...");
    const audioResult = await cloudinary.uploader.upload("uploads/sample.mp3", {
      folder: "dream-wave/audio",
      resource_type: "video" // Audio is treated as video in Cloudinary
    });
    console.log("MP3 uploaded:", audioResult.secure_url);

    const songsToInsert = [
      { title: 'Lover', artist: 'Diljit Dosanjh', audioUrl: audioResult.secure_url, coverImage: coverResult.secure_url },
      { title: 'Born to Shine', artist: 'Diljit Dosanjh', audioUrl: audioResult.secure_url, coverImage: coverResult.secure_url },
      { title: 'Peaches', artist: 'Diljit Dosanjh', audioUrl: audioResult.secure_url, coverImage: coverResult.secure_url },
      { title: 'Clash', artist: 'Diljit Dosanjh', audioUrl: audioResult.secure_url, coverImage: coverResult.secure_url },
      { title: 'Vibe', artist: 'Diljit Dosanjh', audioUrl: audioResult.secure_url, coverImage: coverResult.secure_url }
    ];

    console.log("Clearing existing songs in Atlas...");
    await Song.deleteMany({});

    console.log("Inserting new songs...");
    await Song.insertMany(songsToInsert);
    
    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
  process.exit(0);
};

seedDatabase();
