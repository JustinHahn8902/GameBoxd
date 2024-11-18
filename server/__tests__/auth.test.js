const createApp = require('../app'); // Refactored app.js
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');

const app = createApp();

describe('Authentication Routes', () => {
  beforeEach(async () => {
    await User.deleteMany(); // Clear users before each test
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Close Mongoose connection after tests
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'password123', bio: 'This is my bio' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully.');

      const user = await User.findOne({ username: 'testuser' });
      expect(user).not.toBeNull();
      expect(user.username).toBe('testuser');
    });

    it('should return 400 if username already exists', async () => {
      await User.create({ username: 'existinguser', password: 'password123' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'existinguser', password: 'newpassword' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username already exists.');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const user = new User({ username: 'loginuser', password: 'password123' });
      await user.save();
    });

    it('should log in a user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'loginuser', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful.');
      expect(response.body.userId).toBeDefined();
    });
  });
});
