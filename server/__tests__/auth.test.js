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

  describe('GET /api/auth/search', () => {
    // Set up users before running search tests
    beforeEach(async () => {
      await User.create({ username: 'user1', password: 'password123' });
      await User.create({ username: 'user2', password: 'password123' });
      await User.create({ username: 'anotheruser', password: 'password123' });
    });

    // Test case for searching users
    it('should return a list of users matching the search query', async () => {
      const response = await request(app)
          .get('/api/auth/search')
          .query({ username: 'user' });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(3); // Should return user1 and user2
    });

    // Test case for missing username query parameter
    it('should return 400 when username query parameter is missing', async () => {
      const response = await request(app)
          .get('/api/auth/search');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username is required.');
    });
  });

  describe('GET /api/auth/:id', () => {
    // Set up a user before running get user by ID tests
    let user;
    beforeEach(async () => {
      user = new User({ username: 'testuser', password: 'password123' });
      await user.save();
    });

    // Test case for getting user by ID
    it('should return a user by ID', async () => {
      const response = await request(app)
          .get(`/api/auth/${user._id}`);

      expect(response.status).toBe(200);
      expect(response.body.username).toBe('testuser');
    });

    // Test case for user not found
    it('should return 404 when user isn\'t found', async () => {
      const response = await request(app)
          .get('/api/auth/60c72b2f9b1d8b3a4c8e4d2e'); // Non-existent user ID

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found.');
    });
  });
});
