INSERT INTO store_settings (id, store_name) VALUES ('PROFESSIONAL_VAPE', 'Professional Vape');
INSERT INTO store_settings (id, store_name) VALUES ('PUFF_STORE', 'Puff Store');

INSERT INTO users (username, password, store_id) VALUES ('admin_prof', '$2b$10$PaBJEcYVA6/DcNoSEc7GKO/Fq0SXPEOi7A3CUizMBCdurImbd3L7a', 'PROFESSIONAL_VAPE');
INSERT INTO users (username, password, store_id) VALUES ('admin_puff', '$2b$10$PaBJEcYVA6/DcNoSEc7GKO/Fq0SXPEOi7A3CUizMBCdurImbd3L7a', 'PUFF_STORE');

INSERT INTO product (store_id, barcode, name, milliliters, category, sub_category, purchase_price, retail_price, description, image_url) VALUES
('PROFESSIONAL_VAPE', '8051234568001', 'Suprem-e Artic Mint 10ml', 10, 'LIQUIDO', 'TPD', 3.00, 5.00, 'Liquido pronto 10ml alla menta glaciale', 'https://www.smo-kingshop.it/27448-large_default/suprem-e-artic-mint-10-ml.jpg'),
('PUFF_STORE', '8051234568001', 'Suprem-e Artic Mint 10ml', 10, 'LIQUIDO', 'TPD', 3.00, 5.00, 'Liquido pronto 10ml alla menta glaciale', 'https://www.smo-kingshop.it/27448-large_default/suprem-e-artic-mint-10-ml.jpg'),
('PROFESSIONAL_VAPE', '8051234568002', 'Vaporart Malby 10ml', 10, 'LIQUIDO', 'TPD', 3.50, 6.00, 'Liquido pronto 10ml tabaccoso secco', 'https://www.smo-kingshop.it/26107-large_default/vaporart-malby-10-ml.jpg'),
('PUFF_STORE', '8051234568002', 'Vaporart Malby 10ml', 10, 'LIQUIDO', 'TPD', 3.50, 6.00, 'Liquido pronto 10ml tabaccoso secco', 'https://www.smo-kingshop.it/26107-large_default/vaporart-malby-10-ml.jpg'),
('PROFESSIONAL_VAPE', '8051234568003', 'TNT Vape Booms 10ml', 10, 'LIQUIDO', 'TPD', 4.00, 7.00, 'Liquido pronto 10ml tabaccoso vanigliato', 'https://www.smo-kingshop.it/30043-large_default/tnt-vape-booms-10-ml.jpg'),
('PUFF_STORE', '8051234568003', 'TNT Vape Booms 10ml', 10, 'LIQUIDO', 'TPD', 4.00, 7.00, 'Liquido pronto 10ml tabaccoso vanigliato', 'https://www.smo-kingshop.it/30043-large_default/tnt-vape-booms-10-ml.jpg'),
('PROFESSIONAL_VAPE', '8051234568004', 'Dea Flavor Calliope 10ml', 10, 'LIQUIDO', 'TPD', 3.80, 6.50, 'Liquido pronto 10ml tabacco biondo', 'https://www.smo-kingshop.it/23616-large_default/dea-flavor-calliope-10-ml.jpg'),
('PUFF_STORE', '8051234568004', 'Dea Flavor Calliope 10ml', 10, 'LIQUIDO', 'TPD', 3.80, 6.50, 'Liquido pronto 10ml tabacco biondo', 'https://www.smo-kingshop.it/23616-large_default/dea-flavor-calliope-10-ml.jpg'),
('PROFESSIONAL_VAPE', '8051234568005', 'La Tabaccheria Latakia 10ml', 10, 'LIQUIDO', 'AROMA', 5.00, 9.00, 'Aroma concentrato 10ml tabacco organico', 'https://www.smo-kingshop.it/23946-large_default/la-tabaccheria-latakia-10-ml.jpg'),
('PUFF_STORE', '8051234568005', 'La Tabaccheria Latakia 10ml', 10, 'LIQUIDO', 'AROMA', 5.00, 9.00, 'Aroma concentrato 10ml tabacco organico', 'https://www.smo-kingshop.it/23946-large_default/la-tabaccheria-latakia-10-ml.jpg'),
('PROFESSIONAL_VAPE', '8051234568006', 'Valkiria Shinobi 20ml', 20, 'LIQUIDO', 'SHOT', 10.00, 18.00, 'Aroma scomposto 20ml papaya, fico d india, limone e zucchero', 'https://www.smo-kingshop.it/35043-large_default/valkiria-shinobi-20-ml.jpg'),
('PUFF_STORE', '8051234568006', 'Valkiria Shinobi 20ml', 20, 'LIQUIDO', 'SHOT', 10.00, 18.00, 'Aroma scomposto 20ml papaya, fico d india, limone e zucchero', 'https://www.smo-kingshop.it/35043-large_default/valkiria-shinobi-20-ml.jpg'),
('PROFESSIONAL_VAPE', '8051234568007', 'Super Flavor Round 20ml', 20, 'LIQUIDO', 'SHOT', 10.00, 18.00, 'Aroma scomposto 20ml gelato alla vaniglia e ribes nero', 'https://www.smo-kingshop.it/29906-large_default/super-flavor-round-20-ml.jpg'),
('PUFF_STORE', '8051234568007', 'Super Flavor Round 20ml', 20, 'LIQUIDO', 'SHOT', 10.00, 18.00, 'Aroma scomposto 20ml gelato alla vaniglia e ribes nero', 'https://www.smo-kingshop.it/29906-large_default/super-flavor-round-20-ml.jpg'),
('PROFESSIONAL_VAPE', '8051234568008', 'Galactika Double White 20ml', 20, 'LIQUIDO', 'SHOT', 11.00, 19.90, 'Aroma scomposto 20ml melone, fragola e ghiaccio', 'https://www.smo-kingshop.it/44888-large_default/galactika-double-white-20-ml.jpg'),
('PUFF_STORE', '8051234568008', 'Galactika Double White 20ml', 20, 'LIQUIDO', 'SHOT', 11.00, 19.90, 'Aroma scomposto 20ml melone, fragola e ghiaccio', 'https://www.smo-kingshop.it/44888-large_default/galactika-double-white-20-ml.jpg'),
('PROFESSIONAL_VAPE', '8051234568009', 'Azhad Elixir 10ml', 10, 'LIQUIDO', 'AROMA', 6.00, 11.00, 'Aroma concentrato 10ml miscela di tabacchi pregiati', 'https://www.smo-kingshop.it/23490-large_default/azhad-elixir-10-ml.jpg'),
('PUFF_STORE', '8051234568009', 'Azhad Elixir 10ml', 10, 'LIQUIDO', 'AROMA', 6.00, 11.00, 'Aroma concentrato 10ml miscela di tabacchi pregiati', 'https://www.smo-kingshop.it/23490-large_default/azhad-elixir-10-ml.jpg');

INSERT INTO product (store_id, barcode, name, category, sub_category, purchase_price, retail_price, description, image_url) VALUES
('PROFESSIONAL_VAPE', '8051234568010', 'Geekvape Wenax M1 Kit', 'HARDWARE', 'STARTER_KIT', 12.00, 22.00, 'Kit completo pod mod a forma di penna, batteria 800mAh', 'https://www.smo-kingshop.it/58713-large_default/geekvape-wenax-m1-kit.jpg'),
('PUFF_STORE', '8051234568010', 'Geekvape Wenax M1 Kit', 'HARDWARE', 'STARTER_KIT', 12.00, 22.00, 'Kit completo pod mod a forma di penna, batteria 800mAh', 'https://www.smo-kingshop.it/58713-large_default/geekvape-wenax-m1-kit.jpg'),
('PROFESSIONAL_VAPE', '8051234568011', 'VooPoo Drag X2 Kit', 'HARDWARE', 'STARTER_KIT', 30.00, 55.00, 'Kit completo box mod 80W con atomizzatore PnP X', 'https://www.smo-kingshop.it/70543-large_default/voopoo-drag-x2-kit.jpg'),
('PUFF_STORE', '8051234568011', 'VooPoo Drag X2 Kit', 'HARDWARE', 'STARTER_KIT', 30.00, 55.00, 'Kit completo box mod 80W con atomizzatore PnP X', 'https://www.smo-kingshop.it/70543-large_default/voopoo-drag-x2-kit.jpg'),
('PROFESSIONAL_VAPE', '8051234568012', 'Vaporesso Xros 3 Kit', 'HARDWARE', 'STARTER_KIT', 18.00, 32.00, 'Kit completo pod mod compatta, batteria 1000mAh', 'https://www.smo-kingshop.it/65487-large_default/vaporesso-xros-3-kit.jpg'),
('PUFF_STORE', '8051234568012', 'Vaporesso Xros 3 Kit', 'HARDWARE', 'STARTER_KIT', 18.00, 32.00, 'Kit completo pod mod compatta, batteria 1000mAh', 'https://www.smo-kingshop.it/65487-large_default/vaporesso-xros-3-kit.jpg'),
('PROFESSIONAL_VAPE', '8051234568013', 'Eleaf iStick Power 2C Mod', 'HARDWARE', 'BATTERY_BOX', 25.00, 45.00, 'Box mod dual 18650, potenza massima 160W', 'https://www.smo-kingshop.it/44917-large_default/eleaf-istick-power-2c-mod.jpg'),
('PUFF_STORE', '8051234568013', 'Eleaf iStick Power 2C Mod', 'HARDWARE', 'BATTERY_BOX', 25.00, 45.00, 'Box mod dual 18650, potenza massima 160W', 'https://www.smo-kingshop.it/44917-large_default/eleaf-istick-power-2c-mod.jpg'),
('PROFESSIONAL_VAPE', '8051234568014', 'Aspire Nautilus 3 Tank', 'HARDWARE', 'ATOMIZER_NON_RTA', 15.00, 28.00, 'Atomizzatore a testine intercambiabili per tiro di guancia', 'https://www.smo-kingshop.it/50123-large_default/aspire-nautilus-3-tank.jpg'),
('PUFF_STORE', '8051234568014', 'Aspire Nautilus 3 Tank', 'HARDWARE', 'ATOMIZER_NON_RTA', 15.00, 28.00, 'Atomizzatore a testine intercambiabili per tiro di guancia', 'https://www.smo-kingshop.it/50123-large_default/aspire-nautilus-3-tank.jpg');
