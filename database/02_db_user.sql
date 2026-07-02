-- =====================================================
-- Créer un utilisateur MariaDB dédié au panneau
-- (au lieu d'utiliser root — bien plus sûr)
-- À exécuter dans phpMyAdmin, onglet SQL
-- Remplacez 'MOT_DE_PASSE_FORT' par un mot de passe fort.
-- =====================================================

CREATE USER IF NOT EXISTS 'noor_panel_user'@'%' IDENTIFIED BY 'MOT_DE_PASSE_FORT';

GRANT SELECT, INSERT, UPDATE, DELETE ON noor_panel.* TO 'noor_panel_user'@'%';

FLUSH PRIVILEGES;
