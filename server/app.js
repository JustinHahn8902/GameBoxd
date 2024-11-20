const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const followRoutes = require('./routes/follow');
const unfollowRoutes = require('./routes/unfollow');

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
  app.use('/api/user/followers', followRoutes);
  app.use('/api/user/unfollowers', unfollowRoutes);

  return app;
};

module.exports = createApp;
