INSERT INTO store (id, admin_store_id, slug, store_name) VALUES
(1, 1, 'store1a', 'VapeStore Roma'),
(2, 1, 'store1b', 'VapeStore Milano');

INSERT INTO users (username, password, role, admin_store_id, store_id) VALUES
('master', '$2b$10$PaBJEcYVA6/DcNoSEc7GKO/Fq0SXPEOi7A3CUizMBCdurImbd3L7a', 'MASTER', NULL, NULL),
('admin', '$2b$10$PaBJEcYVA6/DcNoSEc7GKO/Fq0SXPEOi7A3CUizMBCdurImbd3L7a', 'ADMIN_STORE', 1, NULL),
('store_roma', '$2b$10$PaBJEcYVA6/DcNoSEc7GKO/Fq0SXPEOi7A3CUizMBCdurImbd3L7a', 'STORE', 1, 1),
('store_milano', '$2b$10$PaBJEcYVA6/DcNoSEc7GKO/Fq0SXPEOi7A3CUizMBCdurImbd3L7a', 'STORE', 1, 2);

INSERT INTO product (barcode, name, milliliters, category, sub_category, purchase_price, default_price, description, image_url, admin_store_id) VALUES
('8051234567890', 'Mr Yellow Lik Bar Juice Suprem-e Liquido Pronto 10ml Banana Crema Ghiaccio', 10, 'LIQUIDO', 'TPD', 3.54, 5.9, 'Mr Yellow liquido pronto 10ml linea Lik Bar Juice di Suprem-e al gusto di banana split, crema e ghiaccio. Liquido per sigaretta elettronica disponibile con sali di nicotina 2% (20mg/ml) o senza nicotina (0mg/ml): selezionare dal menu a tendina la ...', 'https://www.svapoebasta.com/92106-thickbox_default/mr-yellow-lik-bar-juice-10-ml.jpg', 1),
('8051234567891', 'Cotton Candy Lik Bar Juice Suprem-e Liquido Pronto 10ml Zucchero Filato Ghiaccio', 10, 'LIQUIDO', 'TPD', 3.54, 5.9, 'Cotton Candy liquido pronto 10ml linea Lik Bar Juice di Suprem-e al gusto di zucchero filato e ghiaccio. Liquido per sigaretta elettronica disponibile con sali di nicotina 2% (20mg/ml) o senza nicotina (0mg/ml): selezionare dal menu a tendina la v...', 'https://www.svapoebasta.com/92108-thickbox_default/cotton-candy-lik-bar-juice-10-ml.jpg', 1),
('8051234567892', 'Kentucky Il Distillificio Suprem-e Liquido Pronto 10ml Tabacco Sigaro', 10, 'LIQUIDO', 'TPD', 3.54, 5.9, 'Kentucky liquido pronto 10ml linea Il Distillificio di Suprem-e a base di vero tabacco da sigaro toscano. Prodotto organico distillato trasparente che garantisce lunga durata delle coil: ideale su pod mod e sistemi non rigenerabili. Liquido per si...', 'https://www.svapoebasta.com/90972-thickbox_default/kentucky-distillificio-10-ml.jpg', 1),
('8051234567893', 'Latakia Il Distillificio Suprem-e Liquido Pronto 10ml Tabacco', 10, 'LIQUIDO', 'TPD', 3.54, 5.9, 'Latakia liquido pronto 10ml linea Il Distillificio di Suprem-e a base di vero tabacco affumicato. Prodotto organico distillato trasparente che garantisce lunga durata delle coil: ideale su pod mod e sistemi non rigenerabili. Liquido per sigaretta ...', 'https://www.svapoebasta.com/90973-thickbox_default/latakia-distillificio-10-ml.jpg', 1);

INSERT INTO store_product (store_id, product_id, is_available, custom_price) VALUES
(1, 1, true, NULL),
(2, 1, true, 6.50),
(1, 2, true, NULL),
(2, 2, false, NULL),
(1, 3, false, NULL),
(2, 3, true, 5.50),
(1, 4, true, NULL),
(2, 4, true, NULL);
