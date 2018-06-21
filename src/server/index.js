const path = require('path');
const express = require('express');
const logger = require('morgan');
const http = require('http');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 9000;

app.use(express.static(path.join(__dirname, '../../public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./routes')(app);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});

module.exports = app;
