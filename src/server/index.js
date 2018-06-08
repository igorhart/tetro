const path = require('path');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 9000;

app.use(express.static(path.join(__dirname, '../../public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
