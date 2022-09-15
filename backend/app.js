const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

// Logging
const log = require('cf-nodejs-logging-support');
log.setLoggingLevel('info');

// Express
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(log.logNetwork);

// Info
app.get('/', (req, res) => {
  res.send(`Bridge Framework Backend API for MS Teams port: ${port}`);
});

// System gateway
const SystemRouter = require('./router/SystemRouter');
app.use('/gateway', SystemRouter);

// MS Bot
const path = require('path');
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });
const botActivityHandler = require('./bots/botActivityHandler');
const botAdapter = require('./bots/botAdapter');
app.post('/api/messages', (req, res) => {
  botAdapter.processActivity(req, res, async (context) => {
    await botActivityHandler.run(context);
  });
});

// Server port
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
