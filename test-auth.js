async function testAuth() {
  const res = await fetch('https://dream-wave-iota.vercel.app/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'test_user_' + Date.now(),
      email: 'test' + Date.now() + '@test.com',
      password: 'password123'
    })
  });
  const text = await res.text();
  console.log(res.status, text);
}
testAuth();
