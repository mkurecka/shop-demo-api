-- Demo data for testing the shop API

-- Insert demo products
INSERT INTO products (name, description, price, category, stock, image_url) VALUES
-- Elektronika
('iPhone 15 Pro', 'Nejnovější iPhone s titaniovým rámem a pokročilou kamerou', 35999, 'elektronika', 15, 'https://example.com/iphone15.jpg'),
('Samsung Galaxy S24', 'Prémiový Android smartphone s AI funkcemi', 29999, 'elektronika', 20, 'https://example.com/galaxy-s24.jpg'),
('MacBook Air M3', 'Ultratenký notebook s čipem M3 pro maximální výkon', 42999, 'elektronika', 8, 'https://example.com/macbook-air.jpg'),
('AirPods Pro 2', 'Bezdrátová sluchátka s aktivním potlačením hluku', 7999, 'elektronika', 25, 'https://example.com/airpods-pro.jpg'),
('iPad Pro 12.9"', 'Profesionální tablet s M2 čipem', 38999, 'elektronika', 12, 'https://example.com/ipad-pro.jpg'),
('Apple Watch Series 9', 'Chytré hodinky s GPS a zdravotními funkcemi', 12999, 'elektronika', 18, 'https://example.com/apple-watch.jpg'),
('Sony WH-1000XM5', 'Prémiová sluchátka s potlačením hluku', 8999, 'elektronika', 14, 'https://example.com/sony-headphones.jpg'),
('Nintendo Switch OLED', 'Herní konzole s OLED displejem', 9999, 'elektronika', 10, 'https://example.com/nintendo-switch.jpg'),

-- Oblečení
('Pánské tričko Basic', 'Bavlněné tričko v základních barvách', 599, 'obleceni', 50, 'https://example.com/tricko-basic.jpg'),
('Dámské džíny Slim Fit', 'Pohodlné džíny s elastanem', 1299, 'obleceni', 30, 'https://example.com/dziny-damske.jpg'),  
('Pánská košile Business', 'Elegantní košile pro formální příležitosti', 899, 'obleceni', 25, 'https://example.com/kosile-business.jpg'),
('Dámský svetr s rolákem', 'Teplý svetr z merino vlny', 1599, 'obleceni', 20, 'https://example.com/svetr-rolak.jpg'),
('Sportovní bunda Nike', 'Lehká bunda pro běh a fitness', 2299, 'obleceni', 15, 'https://example.com/bunda-nike.jpg'),
('Pánské kalhoty Chino', 'Neformální kalhoty vhodné do práce i volného času', 1099, 'obleceni', 35, 'https://example.com/kalhoty-chino.jpg'),

-- Domácnost
('Kávovar Delonghi', 'Automatický kávovar s mlýnkem na zrna', 15999, 'domacnost', 6, 'https://example.com/kavovar-delonghi.jpg'),
('Robotický vysavač Roomba', 'Inteligentní vysavač s mapováním prostoru', 12999, 'domacnost', 8, 'https://example.com/roomba.jpg'),
('Air Fryer Philips', 'Horkovzdušná fritéza pro zdravé vaření', 3999, 'domacnost', 12, 'https://example.com/air-fryer.jpg'),
('Mikrovlnná trouba Samsung', 'Multifunkční mikrovlnka s grilem', 4599, 'domacnost', 10, 'https://example.com/mikrovlnka.jpg'),
('Žehlička Braun', 'Parní žehlička s keramickou podešví', 1899, 'domacnost', 18, 'https://example.com/zehlicka.jpg'),
('Mixér KitchenAid', 'Stolní mixér pro přípravu těst a krémů', 8999, 'domacnost', 5, 'https://example.com/mixer-kitchenaid.jpg'),

-- Sport a volný čas
('Běžecké boty Nike Air Zoom', 'Profesionální boty pro běh na silnici', 2999, 'sport', 22, 'https://example.com/bezecke-boty.jpg'),
('Fitness náramek Fitbit', 'Sledování aktivity a zdraví 24/7', 3499, 'sport', 16, 'https://example.com/fitbit.jpg'),
('Jógamatka Premium', 'Protiskluzová podložka pro jógu a cvičení', 799, 'sport', 40, 'https://example.com/jogamatka.jpg'),
('Činky nastavitelné', 'Sada nastavitelných činek 5-25 kg', 4999, 'sport', 8, 'https://example.com/cinky.jpg'),
('Bicykl horské kolo', 'MTB kolo s 21 rychlostmi', 18999, 'sport', 4, 'https://example.com/horske-kolo.jpg');

-- Insert demo customers
INSERT INTO customers (email, first_name, last_name, phone, address, city, postal_code) VALUES
('jan.novak@email.cz', 'Jan', 'Novák', '+420776123456', 'Hlavní 123', 'Praha', '11000'),
('marie.svoboda@email.cz', 'Marie', 'Svobodová', '+420605987654', 'Nádražní 45', 'Brno', '60200'),
('petr.dvorak@email.cz', 'Petr', 'Dvořák', '+420724567890', 'Školní 78', 'Ostrava', '70200'),
('anna.novotna@email.cz', 'Anna', 'Novotná', '+420603456789', 'Komenského 234', 'Plzeň', '30100'),
('tomas.prochazka@email.cz', 'Tomáš', 'Procházka', '+420777333444', 'Masarykova 56', 'České Budějovice', '37001'),
('eva.horakova@email.cz', 'Eva', 'Horáková', '+420608111222', 'Jiráskova 12', 'Hradec Králové', '50002'),
('david.krejci@email.cz', 'David', 'Krejčí', '+420732888999', 'Palackého 89', 'Pardubice', '53002');

-- Insert demo orders
INSERT INTO orders (order_number, customer_id, customer_email, customer_phone, status, total, shipping_address, tracking_number, estimated_delivery) VALUES
('ORD-2024010001', 1, 'jan.novak@email.cz', '+420776123456', 'delivered', 36598, 'Hlavní 123, Praha 11000', 'CP123456789CZ', '2024-01-15'),
('ORD-2024010002', 2, 'marie.svoboda@email.cz', '+420605987654', 'shipped', 8999, 'Nádražní 45, Brno 60200', 'CP987654321CZ', '2024-01-30'),
('ORD-2024010003', 3, 'petr.dvorak@email.cz', '+420724567890', 'processing', 15999, 'Školní 78, Ostrava 70200', NULL, '2024-02-05'),
('ORD-2024010004', 4, 'anna.novotna@email.cz', '+420603456789', 'pending', 2299, 'Komenského 234, Plzeň 30100', NULL, '2024-02-10'),
('ORD-2024010005', 1, 'jan.novak@email.cz', '+420776123456', 'delivered', 1598, 'Hlavní 123, Praha 11000', 'CP555666777CZ', '2024-01-25'),
('ORD-2024010006', 5, 'tomas.prochazka@email.cz', '+420777333444', 'shipped', 42999, 'Masarykova 56, České Budějovice 37001', 'CP444555666CZ', '2024-02-01'),
('ORD-2024010007', 6, 'eva.horakova@email.cz', '+420608111222', 'processing', 7999, 'Jiráskova 12, Hradec Králové 50002', NULL, '2024-02-08'),
('ORD-2024010008', 7, 'david.krejci@email.cz', '+420732888999', 'cancelled', 18999, 'Palackého 89, Pardubice 53002', NULL, NULL),
('ORD-2024010009', 2, 'marie.svoboda@email.cz', '+420605987654', 'delivered', 4598, 'Nádražní 45, Brno 60200', 'CP111222333CZ', '2024-01-20'),
('ORD-2024010010', 3, 'petr.dvorak@email.cz', '+420724567890', 'pending', 12999, 'Školní 78, Ostrava 70200', NULL, '2024-02-12');

-- Insert order items
INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES
-- Order 1: iPhone 15 Pro + tričko
(1, 1, 'iPhone 15 Pro', 1, 35999),
(1, 9, 'Pánské tričko Basic', 1, 599),

-- Order 2: Sony headphones
(2, 7, 'Sony WH-1000XM5', 1, 8999),

-- Order 3: Kávovar
(3, 17, 'Kávovar Delonghi', 1, 15999),

-- Order 4: Sportovní bunda
(4, 13, 'Sportovní bunda Nike', 1, 2299),

-- Order 5: Svetr + tričko
(5, 12, 'Dámský svetr s rolákem', 1, 1599),

-- Order 6: MacBook Air M3
(6, 3, 'MacBook Air M3', 1, 42999),

-- Order 7: AirPods Pro 2
(7, 4, 'AirPods Pro 2', 1, 7999),

-- Order 8: Horské kolo (cancelled)
(8, 25, 'Bicykl horské kolo', 1, 18999),

-- Order 9: Air Fryer + žehlička
(9, 19, 'Air Fryer Philips', 1, 3999),
(9, 21, 'Žehlička Braun', 1, 1899),

-- Order 10: Apple Watch + Fitbit
(10, 6, 'Apple Watch Series 9', 1, 12999);
