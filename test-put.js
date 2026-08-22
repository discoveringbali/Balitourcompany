const http = require('http');

const data = JSON.stringify({
  id: 'ed7792ae-a93d-4282-9b64-0dbd45e96abe',
  title: '25 Best Things to Do in Ubud, Bali: The Complete 2026 Guide',
  slug: '/blog/25-best-things-to-do-in-ubud-bali',
  content: '<h2>Test Content</h2>',
  status: 'Published'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/blogs',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => process.stdout.write(d));
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
