$coverUrl = "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b1/33/44/b133441f-6cb5-d3ba-852c-72608c316900/5026854097978.jpg/600x600bb.jpg"
curl.exe -o cover.jpg $coverUrl

curl.exe -X POST -F "title=Lover" -F "artist=Diljit Dosanjh" -F "audio=@uploads/sample.mp3" -F "cover=@cover.jpg" http://localhost:5000/api/songs/upload
curl.exe -X POST -F "title=Born to Shine" -F "artist=Diljit Dosanjh" -F "audio=@uploads/sample.mp3" -F "cover=@cover.jpg" http://localhost:5000/api/songs/upload
curl.exe -X POST -F "title=Peaches" -F "artist=Diljit Dosanjh" -F "audio=@uploads/sample.mp3" -F "cover=@cover.jpg" http://localhost:5000/api/songs/upload
curl.exe -X POST -F "title=Clash" -F "artist=Diljit Dosanjh" -F "audio=@uploads/sample.mp3" -F "cover=@cover.jpg" http://localhost:5000/api/songs/upload
curl.exe -X POST -F "title=Vibe" -F "artist=Diljit Dosanjh" -F "audio=@uploads/sample.mp3" -F "cover=@cover.jpg" http://localhost:5000/api/songs/upload
