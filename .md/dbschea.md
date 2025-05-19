-- Create the database
CREATE DATABASE IF NOT EXISTS employee_management;
USE employee_management;

-- Employees table with auto-incrementing ID
CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    password VARCHAR(255) NOT NULL,  -- For storing hashed passwords
    role VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    hire_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Add constraints
    CONSTRAINT chk_age CHECK (age >= 18)
);

-- Table for storing employee files (multiple files per employee)
CREATE TABLE IF NOT EXISTS employee_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,        -- Stored filename (should be unique)
    original_name VARCHAR(255) NOT NULL,    -- Original filename uploaded by user
    file_type VARCHAR(100) NOT NULL,        -- MIME type of the file
    file_size INT NOT NULL,                 -- Size in bytes
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key relationship to employees table with cascade deletion
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Table for user roles and permissions (for future expansion)
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for storing application users (admins, managers, etc.)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- For storing hashed passwords
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Insert default roles
INSERT INTO roles (role_name, description) VALUES
('admin', 'Administrator with full access'),
('manager', 'Manager with limited administrative access'),
('user', 'Standard user with view-only access');

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password, role_id) VALUES
('admin', 'admin@gmail.com', '$2y$10$8MYzJBE3KHbJhQ3tJMF4RuzQP7B0zDA2ZQ3Th/AX7GXJMJX6.7IIO', 1);

-- Sample departments for dropdown
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Insert default departments
INSERT INTO departments (name) VALUES
('HR'),
('IT'),
('Finance'),
('Marketing'),
('Operations'),
('Sales');

-- Create indexes for faster queries
CREATE INDEX idx_employee_department ON employees(department);
CREATE INDEX idx_employee_role ON employees(role);
CREATE INDEX idx_employee_files ON employee_files(employee_id);
CREATE INDEX idx_user_role ON users(role_id);