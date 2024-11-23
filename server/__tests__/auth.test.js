const createApp = require('../app'); // Refactored app.js
const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');

const app = createApp();

describe('Authentication Routes', () => {
  // Clear the database before each test
  beforeEach(async () => {
    await User.deleteMany();
  });

  // Close the Mongoose connection after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/auth/register', () => {
    // AI-Generated Test Case
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

    // AI-Generated Test Case
    it('should return 400 if username already exists', async () => {
      await User.create({ username: 'existinguser', password: 'password123' });

      const response = await request(app)
          .post('/api/auth/register')
          .send({ username: 'existinguser', password: 'newpassword' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username already exists.');
    });

    // Manually Created Test Case
    it('should return 400 when username isn\'t in request body', async () => {
      const response = await request(app)
          .post('/api/auth/register')
          .send({ password: 'password123', bio: 'This is my bio' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password are required');
    });

    // Manually Created Test Case
    it('should return 400 when password isn\'t in request body', async () => {
      const response = await request(app)
          .post('/api/auth/register')
          .send({ username: 'testuser', bio: 'This is my bio' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password are required');
    });
  });

  describe('POST /api/auth/login', () => {
    // Set up a user before running login tests
    beforeEach(async () => {
      const user = new User({ username: 'loginuser', password: 'password123' });
      await user.save();
    });

    // AI-Generated Test Case
    it('should log in a user successfully', async () => {
      const response = await request(app)
          .post('/api/auth/login')
          .send({ username: 'loginuser', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful.');
      expect(response.body.userId).toBeDefined();
    });

    // Manually Created Test Case
    it('should return 400 when username isn\'t in request body', async () => {
      const response = await request(app)
          .post('/api/auth/login')
          .send({ password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password are required.');
    });

    // Manually Created Test Case
    it('should return 400 when password isn\'t in request body', async () => {
      const response = await request(app)
          .post('/api/auth/login')
          .send({ username: 'testuser' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username and password are required.');
    });

    // Manually Created Test Case
    it('should return 404 when user isn\'t found', async () => {
      const response = await request(app)
          .post('/api/auth/login')
          .send({ username: 'nonexistentuser', password: 'password123' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found.');
    });

    // Manually Created Test Case
    it('should return 401 when password is invalid', async () => {
      const response = await request(app)
          .post('/api/auth/login')
          .send({ username: 'loginuser', password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid password.');
    });
  });
});
