-- =====================================================
-- NOOR-SARL — Messagerie et documents liés à une demande de service
-- MariaDB 11 / MySQL
-- =====================================================

USE noor_panel;

-- Chat entre le client et l'administration, rattaché à une demande de service précise
CREATE TABLE IF NOT EXISTS service_messages (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  service_request_id  INT UNSIGNED NOT NULL,
  user_id             INT UNSIGNED NOT NULL,
  body                TEXT NOT NULL,
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_svcmsg_request FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE CASCADE,
  CONSTRAINT fk_svcmsg_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_svcmsg_request ON service_messages(service_request_id);

-- Documents demandés par l'administration et envoyés par le client, pour une demande de service précise
CREATE TABLE IF NOT EXISTS service_documents (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  service_request_id  INT UNSIGNED NOT NULL,
  label               VARCHAR(190) NOT NULL,
  status              ENUM('demande','envoye') NOT NULL DEFAULT 'demande',
  file_name           VARCHAR(255) DEFAULT NULL,
  file_path           VARCHAR(255) DEFAULT NULL,
  file_size           INT UNSIGNED DEFAULT NULL,
  requested_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  uploaded_at         TIMESTAMP NULL DEFAULT NULL,
  CONSTRAINT fk_svcdoc_request FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_svcdoc_request ON service_documents(service_request_id);
