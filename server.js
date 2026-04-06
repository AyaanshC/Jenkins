const http = require('http');
const fs   = require('fs');
const PORT = 3000;

const server = http.createServer((req, res) => {
    let html = fs.readFileSync('/opt/app/index.html', 'utf8');

    // Inject the real Jenkins build number into the page
    const buildNum = process.env.BUILD_NUMBER || '1';
    html = html.replace(
        '</head>',
        `<script>window.__BUILD_NUMBER__ = '${buildNum}';</script></head>`
    );

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`App running on port ${PORT} — Build #${process.env.BUILD_NUMBER || '1'}`);
});