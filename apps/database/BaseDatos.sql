-- Crear base de datos
CREATE DATABASE IF NOT EXISTS education_center_v2;
USE education_center_v2;
-- Tabla de roles con permisos
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  permissions TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Tabla de usuarios (login)
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role_id INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);
-- Tabla de refresh tokens
CREATE TABLE refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_refresh_tokens_user (user_id),
  INDEX idx_refresh_tokens_token (token)
);
-- Tabla de sedes
CREATE TABLE sedes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(10) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Tabla de procesos de inscripción
CREATE TABLE registration_processes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Tabla de turnos
CREATE TABLE turns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Tabla de planes de pago
CREATE TABLE payment_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(20) NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  installments INT DEFAULT 1,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Tabla de salones
CREATE TABLE salons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  priority INT DEFAULT 1,
  capacity INT NOT NULL,
  sede_id INT NOT NULL,
  turn_id INT NOT NULL,
  registration_process_id INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sede_id) REFERENCES sedes(id),
  FOREIGN KEY (turn_id) REFERENCES turns(id),
  FOREIGN KEY (registration_process_id) REFERENCES registration_processes(id),
  INDEX idx_salons_sede_turn (sede_id, turn_id)
);
-- Tabla de alumnos (sin foto en base64)
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_code VARCHAR(20) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  dni VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  date_of_birth DATE,
  address TEXT,
  emergency_contact VARCHAR(100),
  emergency_phone VARCHAR(20),
  registration_date DATE NOT NULL,
  payment_plan_id INT NOT NULL,
  registration_process_id INT NOT NULL,
  sede_id INT NOT NULL,
  salon_id INT NOT NULL,
  turn_id INT NOT NULL,
  photo_url VARCHAR(500),
  photo_public_id VARCHAR(255),
  has_paid_registration BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_plan_id) REFERENCES payment_plans(id),
  FOREIGN KEY (registration_process_id) REFERENCES registration_processes(id),
  FOREIGN KEY (sede_id) REFERENCES sedes(id),
  FOREIGN KEY (salon_id) REFERENCES salons(id),
  FOREIGN KEY (turn_id) REFERENCES turns(id),
  INDEX idx_students_dni (dni),
  INDEX idx_students_salon (salon_id),
  INDEX idx_students_sede (sede_id),
  INDEX idx_students_active (is_active)
);
-- Tabla de pagos
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(50),
  reference_number VARCHAR(100),
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  INDEX idx_payments_student (student_id),
  INDEX idx_payments_date (payment_date)
);
-- Tabla de auditoría
CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_name VARCHAR(50) NOT NULL,
  record_id INT NOT NULL,
  action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
  old_values JSON,
  new_values JSON,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_audit_table_record (table_name, record_id),
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_date (created_at)
);