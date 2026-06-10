# Dream Wave 🎵

![Dream Wave](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933)
![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E)

Dream Wave is a professional, full-stack music streaming platform inspired by Spotify. It features a stunning dark-mode UI with dynamic glassmorphism, seamless audio playback, and a comprehensive backend architecture for managing users, songs, and albums.

## 🌟 Features

- **Modern User Interface:** A stunning, premium aesthetic featuring dark mode, neon accents, and smooth micro-animations.
- **Full Music Player:** Play, pause, skip, and seek through tracks using a persistent global audio player.
- **Multi-Track Album Uploads:** Effortlessly upload entire albums, complete with cover art and individual audio files, in a single action.
- **Secure Authentication:** Robust user registration, login, and secure session handling.
- **Cloud Storage:** Direct-to-cloud audio and image storage utilizing Supabase Storage for maximum performance.
- **Responsive Layout:** Perfectly optimized for mobile, tablet, and desktop viewing.

## 🚀 Tech Stack

### Frontend
- **React.js** (via Vite)
- **Vanilla CSS** (Custom Design System & Variables)
- **Lucide Icons**
- **Axios**

### Backend
- **Node.js & Express.js**
- **Supabase** (PostgreSQL Database & Object Storage)
- **Multer** (File Handling)

## 🛠️ Installation & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/pukhrajsharmapukhrajsharma392-ai/Dream-wave.git
cd Dream-wave
```

### 2. Setup Environment Variables
Create a `.env` file in the `backend/` directory with your Supabase credentials:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Install Dependencies
Install dependencies for both the frontend and backend:
```bash
npm run install
npm run build
```

### 4. Start the Application
Run the full stack concurrently:
```bash
npm run dev
```
The frontend will run on `http://localhost:5173` and the backend on `http://localhost:5000`.

## 🌐 Live Demo
The application is deployed live on Vercel:
[https://dream-wave-iota.vercel.app/](https://dream-wave-iota.vercel.app/)

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
