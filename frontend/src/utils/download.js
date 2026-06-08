import { ID3Writer } from 'browser-id3-writer';

export const downloadSongWithMetadata = async (song) => {
  if (!song || !song.audioUrl) return;

  try {
    // 1. Fetch the audio file as ArrayBuffer
    const audioResponse = await fetch(song.audioUrl);
    const audioBuffer = await audioResponse.arrayBuffer();

    let coverBuffer = null;
    let coverMimeType = 'image/jpeg';
    
    // 2. Fetch the cover image as ArrayBuffer
    if (song.coverImage) {
      try {
        const coverResponse = await fetch(song.coverImage);
        coverBuffer = await coverResponse.arrayBuffer();
        
        // determine mime type basically
        if (song.coverImage.toLowerCase().endsWith('.png')) {
          coverMimeType = 'image/png';
        }
      } catch (imgErr) {
        console.warn("Could not fetch cover image for ID3 tags:", imgErr);
      }
    }

    // 3. Write ID3 Tags
    const writer = new ID3Writer(audioBuffer);
    
    writer.setFrame('TIT2', song.title || 'Unknown Title')
          .setFrame('TPE1', [song.artist || 'Unknown Artist'])
          .setFrame('TALB', 'Dream Wave Music')
          .setFrame('TPUB', 'Dream Wave');

    if (coverBuffer) {
      writer.setFrame('APIC', {
        type: 3, // cover front
        data: coverBuffer,
        description: 'Cover art',
        useUnicodeEncoding: false
      });
    }

    writer.addTag();

    const taggedSongBuffer = writer.arrayBuffer;
    const blob = new Blob([taggedSongBuffer], { type: 'audio/mpeg' });
    const downloadUrl = window.URL.createObjectURL(blob);
    
    // 4. Trigger download
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `[Dream Wave] ${song.title} - ${song.artist}.mp3`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
    
  } catch (error) {
    console.error("Failed to tag/download:", error);
    
    // Fallback: If tagging fails (e.g., CORS or not an MP3), force standard download
    let fallbackUrl = song.audioUrl;
    if (fallbackUrl.includes('supabase.co/storage')) {
      const separator = fallbackUrl.includes('?') ? '&' : '?';
      fallbackUrl = `${fallbackUrl}${separator}download=${encodeURIComponent(`[Dream Wave] ${song.title} - ${song.artist}.mp3`)}`;
    }
    const a = document.createElement('a');
    a.href = fallbackUrl;
    a.download = `[Dream Wave] ${song.title} - ${song.artist}.mp3`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
};
