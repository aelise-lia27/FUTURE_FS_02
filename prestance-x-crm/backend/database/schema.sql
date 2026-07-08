-- ============================================================
-- Prestance X - Mini CRM Database Schema
-- Run this in phpMyAdmin (XAMPP) or via mysql CLI:
--   mysql -u root -p < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS prestance_x_crm
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE prestance_x_crm;

-- ------------------------------------------------------------
-- Table: users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'commercial') NOT NULL DEFAULT 'commercial',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table: leads
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  email VARCHAR(150) NULL,
  city VARCHAR(100) NULL,
  interested_product ENUM('Shirts', 'Pants', 'Cardigans', 'Jackets', 'Ties', 'Shoes') NOT NULL,
  message TEXT NULL,
  lead_source ENUM('WhatsApp', 'Facebook', 'Instagram', 'Website', 'Referral', 'Walk-in') NOT NULL DEFAULT 'Website',
  status ENUM('New', 'Contacted', 'Converted') NOT NULL DEFAULT 'New',
  assigned_to INT NULL,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_leads_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_leads_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Table: notes  (follow-up notes on leads)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  author_id INT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notes_lead FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  CONSTRAINT fk_notes_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Helpful indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(lead_source);
CREATE INDEX idx_notes_lead_id ON notes(lead_id);
