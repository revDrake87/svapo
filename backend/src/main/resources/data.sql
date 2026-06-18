INSERT INTO store_settings (id, store_name) VALUES (1, 'VapeStore');

INSERT INTO users (username, password) VALUES ('admin', '$2b$10$PaBJEcYVA6/DcNoSEc7GKO/Fq0SXPEOi7A3CUizMBCdurImbd3L7a');

INSERT INTO product (barcode, name, milliliters, category, sub_category, purchase_price, retail_price, description, image_url, flavor, ingredients, nicotine_strength) VALUES 
('8051234567890', 'Menta Glaciale 10ml', 10, 'LIQUIDO', 'TPD', 2.00, 5.90, 'Liquido pronto all''uso freschissimo', 'https://placehold.co/500x500/000000/FFFFFF/png?text=Menta+Glaciale', 'Menta', 'Menta, Ghiaccio', '4mg/ml'),
('8051234567891', 'Menta Glaciale 10ml Forte', 10, 'LIQUIDO', 'TPD', 2.00, 5.90, 'Liquido pronto all''uso freschissimo', 'https://placehold.co/500x500/000000/FFFFFF/png?text=Menta+Forte', 'Menta', 'Menta, Ghiaccio, Eucalipto', '8mg/ml'),
('8051234567892', 'Tabacco Secco Mini', 10, 'LIQUIDO', 'MINI_SHOT_10_10', 4.50, 12.90, 'Aroma concentrato scomposto', 'https://placehold.co/500x500/000000/FFFFFF/png?text=Tabacco+Secco', 'Tabacco', 'Virginia, Latakia', NULL),
('8051234567893', 'Tabacco Dolce Shot', 20, 'LIQUIDO', 'SHOT', 6.00, 18.50, 'Aroma concentrato scomposto grande', 'https://placehold.co/500x500/000000/FFFFFF/png?text=Tabacco+Dolce', 'Tabacco e Vaniglia', 'Tabacco Burley, Vaniglia, Caramello', NULL),
('8051234567894', 'Aroma Fragola 10ml', 10, 'LIQUIDO', 'AROMA', 2.50, 6.00, 'Aroma puro da diluire', 'https://placehold.co/500x500/000000/FFFFFF/png?text=Aroma+Fragola', 'Fragola', 'Fragola, Zucchero', NULL),
('8051234567895', 'Nicotina Base 10ml', 10, 'LIQUIDO', 'NICOTINE_SHOT', 1.00, 2.50, 'Shot di nicotina neutra', 'https://placehold.co/500x500/000000/FFFFFF/png?text=Nicotina+Base', NULL, NULL, '18mg/ml'),
('8051234567896', 'Nicotina Base 10ml Salt', 10, 'LIQUIDO', 'NICOTINE_SHOT', 1.20, 2.50, 'Shot di nicotina neutra ai sali', 'https://placehold.co/500x500/000000/FFFFFF/png?text=Nicotina+Salt', NULL, NULL, '20mg/ml Salt'),
('8051234567897', 'Nicotina Vaporart Full VG 20mg/ml', 10, 'LIQUIDO', 'NICOTINE_SHOT', 1.50, 3.20, 'Nicobooster VaporArt Full VG base neutra 100% glicerina vegetale', 'https://placehold.co/500x500/000000/FFFFFF/png?text=Nicotina+VG', NULL, NULL, '20mg/ml');

INSERT INTO product (barcode, name, category, sub_category, purchase_price, retail_price, description, color, battery_type, wattage, tank_capacity, image_url) VALUES
('8051234567898', 'GeekVape Aegis Legend 2', 'HARDWARE', 'BATTERY_BOX', 35.00, 55.00, 'Box mod resistente ad acqua e urti', 'Nero', 'Doppia 18650', 200, NULL, 'https://placehold.co/500x500/000000/FFFFFF/png?text=Aegis+Legend'),
('8051234567899', 'Zeus X RTA', 'HARDWARE', 'ATOMIZER_RTA', 18.00, 32.00, 'Atomizzatore rigenerabile a mesh', 'Silver', NULL, NULL, 4.5, 'https://placehold.co/500x500/000000/FFFFFF/png?text=Zeus+X+RTA'),
('8051234567900', 'Zlide Innokin', 'HARDWARE', 'ATOMIZER_NON_RTA', 12.00, 22.00, 'Atomizzatore a testine non rigenerabile', 'Gunmetal', NULL, NULL, 2.0, 'https://placehold.co/500x500/000000/FFFFFF/png?text=Zlide+Innokin'),
('8051234567901', 'Eleaf iStick Pico Starter Kit', 'HARDWARE', 'STARTER_KIT', 20.00, 38.00, 'Kit completo con batteria e atomizzatore', 'Rosa', 'Singola 18650', 75, 2.0, 'https://placehold.co/500x500/000000/FFFFFF/png?text=iStick+Pico'),
('8051234567902', 'Kiwi Pen Pod Mod', 'HARDWARE', 'POD_MOD', 25.00, 45.00, 'Pod mod elegante per smettere di fumare', 'Iron Gate', 'Integrata 400mAh', 13, 1.8, 'https://placehold.co/500x500/000000/FFFFFF/png?text=Kiwi+Pen'),
('8051234567903', 'Pod Ricambio Kiwi (3pz)', 'HARDWARE', 'POD_ACCESSORY', 5.00, 11.90, 'Cartucce di ricambio per Kiwi Pen', 'Clear', NULL, NULL, 1.8, 'https://placehold.co/500x500/000000/FFFFFF/png?text=Pod+Kiwi'),
('8051234567904', 'Pinzette in Ceramica Coil Master', 'HARDWARE', 'ACCESSORY', 3.00, 6.50, 'Pinzette per sistemare le resistenze', 'Nero', NULL, NULL, NULL, 'https://placehold.co/500x500/000000/FFFFFF/png?text=Pinzette+Ceramica');
