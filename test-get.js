async function testGet() {
  const res = await fetch('https://dream-wave-iota.vercel.app/api/songs');
  const text = await res.text();
  console.log(res.status, text.substring(0, 100));
}
testGet();
