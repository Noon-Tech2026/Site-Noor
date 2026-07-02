-- =====================================================
-- NOOR-SARL — Base de données du Panneau Client
-- MariaDB 11 / MySQL
-- À exécuter dans phpMyAdmin (https://db.noor.lu)
-- =====================================================

-- 1. Créer la base de données
CREATE DATABASE IF NOT EXISTS noor_panel
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE noor_panel;

-- =====================================================
-- 2. Table des utilisateurs (admin + clients)
--    Le mot de passe est TOUJOURS haché (bcrypt), jamais en clair.
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(190) NOT NULL,
  role          ENUM('admin','client') NOT NULL DEFAULT 'client',
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =====================================================
-- 3. Table des projets/sites clients
--    Chaque client (user) peut avoir un ou plusieurs sites.
-- =====================================================
CREATE TABLE IF NOT EXISTS sites (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  name         VARCHAR(190) NOT NULL,
  domain       VARCHAR(190) DEFAULT NULL,
  status       ENUM('en_cours','en_revision','en_ligne','suspendu') NOT NULL DEFAULT 'en_cours',
  site_url     VARCHAR(255) DEFAULT NULL,
  db_url       VARCHAR(255) DEFAULT NULL,
  files_url    VARCHAR(255) DEFAULT NULL,
  notes        TEXT DEFAULT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =====================================================
-- 4. Table des fichiers/documents
-- =====================================================
CREATE TABLE IF NOT EXISTS documents (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  site_id      INT UNSIGNED DEFAULT NULL,
  title        VARCHAR(190) NOT NULL,
  file_path    VARCHAR(255) NOT NULL,
  file_type    VARCHAR(60) DEFAULT NULL,
  file_size    INT UNSIGNED DEFAULT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_docs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_docs_site FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================
-- 5. Table des factures / paiements
-- =====================================================
CREATE TABLE IF NOT EXISTS invoices (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  site_id      INT UNSIGNED DEFAULT NULL,
  invoice_number VARCHAR(60) NOT NULL UNIQUE,
  amount_mru   DECIMAL(12,2) NOT NULL,
  status       ENUM('impayee','payee','en_retard','annulee') NOT NULL DEFAULT 'impayee',
  issued_date  DATE NOT NULL,
  due_date     DATE DEFAULT NULL,
  paid_date    DATE DEFAULT NULL,
  description  TEXT DEFAULT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_inv_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_inv_site FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================
-- 6. Table des sessions (jetons de connexion sécurisés)
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  token_hash   VARCHAR(255) NOT NULL UNIQUE,
  expires_at   TIMESTAMP NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sess_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Index utiles
CREATE INDEX idx_sites_user   ON sites(user_id);
CREATE INDEX idx_docs_user    ON documents(user_id);
CREATE INDEX idx_inv_user     ON invoices(user_id);
CREATE INDEX idx_sess_token   ON sessions(token_hash);
