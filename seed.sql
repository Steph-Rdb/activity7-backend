INSERT INTO records (title, category, description, status)
SELECT s.title, s.category, s.description, s.status
FROM (VALUES
('Laptop cannot connect to Wi-Fi','Network','The laptop cannot connect to the campus wireless network.','Pending'),
('Printer not responding','Hardware','The library printer does not respond when a document is sent.','In progress'),
('Operating system update problem','Software','The computer fails when installing the latest system update.','Pending'),
('Keyboard keys not working','Hardware','Several keys on the computer lab keyboard do not respond.','Completed'),
('Email application keeps closing','Software','The email application closes shortly after it is opened.','Pending'),
('Slow internet in computer lab','Network','Internet access in the computer lab is unusually slow.','In progress'),
('Monitor displays a blank screen','Hardware','The desktop monitor powers on but displays no picture.','Pending'),
('Unable to install required software','Software','A student cannot install the required programming application.','Completed')
) AS s(title, category, description, status)
WHERE NOT EXISTS (SELECT 1 FROM records);
