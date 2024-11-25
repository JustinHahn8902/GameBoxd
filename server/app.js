const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const userRoutes = require('./routes/user');
const listRoutes = require('./routes/lists');

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
  app.use('/api/games', gameRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/lists', listRoutes);


  return app;
};

module.exports = createApp;
