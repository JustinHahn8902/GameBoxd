
// Getting all dependencies loaded
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/auth');

dotenv.config();

// Make express app
const app = express();

// Basic middleware log
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});
app.use(cors());
app.use(express.json());

// Connect to MongoDB when setup
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Dummy home route
app.get('/',  (req, res) => {
    res.send('Default route works!');
});

// Routes
app.use('/api/auth', authRoutes);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});