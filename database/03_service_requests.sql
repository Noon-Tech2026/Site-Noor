-- =====================================================
-- NOOR-SARL — Demandes de services (visiteurs -> clients)
-- MariaDB 11 / MySQL
-- =====================================================

USE noor_panel;

CREATE TABLE IF NOT EXISTS service_requests (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED NOT NULL,
  service_key  VARCHAR(60) NOT NULL,
  status       ENUM('nouvelle','en_contact','en_cours','terminee','annulee') NOT NULL DEFAULT 'nouvelle',
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_svcreq_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_user_service (user_id, service_key)
) ENGINE=InnoDB;

CREATE INDEX idx_svcreq_user ON service_requests(user_id);
