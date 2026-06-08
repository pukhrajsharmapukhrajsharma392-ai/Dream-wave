-- Create public.users table to mirror auth.users and store custom profile data
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on users but allow public reads
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.users FOR UPDATE USING (auth.uid() = id);

-- Create songs table
CREATE TABLE public.songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  cover_image TEXT,
  audio_url TEXT NOT NULL,
  lyrics TEXT,
  plays INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on songs
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Songs are viewable by everyone." ON public.songs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert songs." ON public.songs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Note: In our Node.js backend we use the service role key, which bypasses RLS anyway.

-- Create playlists table
CREATE TABLE public.playlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Playlists are viewable by everyone." ON public.playlists FOR SELECT USING (true);

-- Create playlist_songs junction table
CREATE TABLE public.playlist_songs (
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE,
  song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE,
  PRIMARY KEY (playlist_id, song_id)
);

ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Playlist songs are viewable by everyone." ON public.playlist_songs FOR SELECT USING (true);

-- Create user_favorites junction table
CREATE TABLE public.user_favorites (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, song_id)
);

ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User favorites are viewable by the user." ON public.user_favorites FOR SELECT USING (auth.uid() = user_id);

-- Create a trigger to automatically create a public.user profile when a new auth.user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, username, avatar)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'username', 'User'), '');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
