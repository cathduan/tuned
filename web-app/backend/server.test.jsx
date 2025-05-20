import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import server from './server.jsx';
import { Pool } from 'pg';

// Fix the dotenv mock to match how it's used in the server file
vi.mock('dotenv', () => {
  return {
    default: {
      config: vi.fn() 
    },
    config: vi.fn() // This is the function that's called directly
  };
});

// Mock pg Pool
vi.mock('pg', () => {
  const mockPool = {
    query: vi.fn()
  };
  
  return {
    Pool: vi.fn(() => mockPool)
  };
});

vi.mock('bcrypt', () => {
  const compare = vi.fn();
  const genSalt = vi.fn();
  const hash = vi.fn();

  return {
    default: {
      compare,
      genSalt,
      hash
    },
    compare,
    genSalt,
    hash
  };
});
 

// Mock jsonwebtoken
vi.mock('jsonwebtoken', () => {
  return {
    sign: vi.fn()
  };
});

// Set test environment variables
process.env.JWT_SECRET = 'test_secret_key';


describe('Login Authentication Tests', () => {
  // Get the mock pool instance
  const pool = new Pool();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should successfully authenticate a user with valid credentials', async () => {
    // Arrange
    const mockUser = {
      id: 1,
      username: 'testuser',
      password_hash: 'hashedpassword123'
    };
    
    // Mock database response
    pool.query.mockResolvedValueOnce({
      rows: [mockUser],
      rowCount: 1
    });
    
    // Mock password verification
    bcrypt.compare.mockResolvedValueOnce(true);
    
    // Mock JWT token generation
    const mockToken = 'mock.jwt.token';
    jwt.sign.mockReturnValueOnce(mockToken);
    
    // Act
    const response = await request(server)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    
    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM profiles WHERE username = $1',
      ['testuser']
    );
    
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword123');
    
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 1, username: 'testuser' },
      'test_secret_key',
      { expiresIn: '1h' }
    );
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Login successful',
      token: mockToken
    });
  });

  it('should return error for invalid password', async () => {
    // Arrange
    const mockUser = {
      id: 1,
      username: 'testuser',
      password_hash: 'hashedpassword123'
    };
    
    // Mock database response
    pool.query.mockResolvedValueOnce({
      rows: [mockUser],
      rowCount: 1
    });
    
    // Mock failed password comparison
    bcrypt.compare.mockResolvedValueOnce(false);
    
    // Act
    const response = await request(server)
      .post('/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword'
      });
    
    // Assert
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM profiles WHERE username = $1',
      ['testuser']
    );
    
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword123');
    
    // JWT should not be called for invalid credentials
    expect(jwt.sign).not.toHaveBeenCalled();
    
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Invalid email or password'
    });
  });
});