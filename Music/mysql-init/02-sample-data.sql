-- Sample data for testing (optional)
-- This file can be used to insert test users or initial data

-- Note: Passwords should be hashed in production
-- These are plain text examples for testing only

-- Insert a test admin user (password: admin123)
-- In production, use proper password hashing
INSERT IGNORE INTO users (email, password, username, role) 
VALUES ('admin@music.com', 'admin123', 'admin', 'ADMIN');

-- Insert a test regular user (password: user123)
INSERT IGNORE INTO users (email, password, username, role) 
VALUES ('user@music.com', 'user123', 'testuser', 'USER');

-- Note: In production, always hash passwords using bcrypt or similar
-- The Spring Boot application should handle password hashing

