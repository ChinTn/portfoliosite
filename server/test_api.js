async function testContact() {
  try {
    const res = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        email: 'vaghamshichintan9@gmail.com',
        subject: 'Test Subject',
        message: 'Test Message'
      })
    });
    const data = await res.json();
    console.log('Success:', res.status, data);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testContact();
