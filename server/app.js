const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Dummy home route
  app.get('/', (req, res) => {
    res.send('Default route works!');
  });

  // Routes
  app.use('/api/auth', authRoutes);

  return app;
};

module.exports = createApp;
