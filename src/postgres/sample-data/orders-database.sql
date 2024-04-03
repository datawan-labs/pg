-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    age INT,
    email VARCHAR(100),
    address VARCHAR(200),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    phone VARCHAR(20),
    is_active BOOLEAN
);

-- Insert dummy data into users table
INSERT INTO users (name, age, email, address, city, state, country, phone, is_active)
VALUES
    ('John Doe', 30, 'john.doe@example.com', '123 Main St', 'New York', 'NY', 'USA', '123-456-7890', true),
    ('Jane Smith', 25, 'jane.smith@example.com', '456 Elm St', 'Los Angeles', 'CA', 'USA', '987-654-3210', true),
    ('Alice Johnson', 35, 'alice.johnson@example.com', '789 Oak St', 'Chicago', 'IL', 'USA', '555-123-4567', false),
    ('Bob Brown', 40, 'bob.brown@example.com', '101 Pine St', 'Houston', 'TX', 'USA', '111-222-3333', true),
    ('Eva Martinez', 28, 'eva.martinez@example.com', '202 Maple St', 'Miami', 'FL', 'USA', '444-555-6666', false),
    ('Michael Lee', 33, 'michael.lee@example.com', '303 Cedar St', 'San Francisco', 'CA', 'USA', '777-888-9999', true),
    ('Sophia White', 22, 'sophia.white@example.com', '404 Birch St', 'Seattle', 'WA', 'USA', '888-777-6666', true),
    ('William Davis', 29, 'william.davis@example.com', '505 Walnut St', 'Boston', 'MA', 'USA', '999-000-1111', false),
    ('Olivia Taylor', 31, 'olivia.taylor@example.com', '606 Oak St', 'Austin', 'TX', 'USA', '000-999-8888', true),
    ('James Anderson', 27, 'james.anderson@example.com', '707 Elm St', 'Denver', 'CO', 'USA', '111-222-3333', false),
    ('Emma Clark', 34, 'emma.clark@example.com', '808 Maple St', 'Philadelphia', 'PA', 'USA', '222-333-4444', true),
    ('Daniel Rodriguez', 32, 'daniel.rodriguez@example.com', '909 Pine St', 'Phoenix', 'AZ', 'USA', '333-444-5555', true),
    ('Mia Hernandez', 26, 'mia.hernandez@example.com', '111 Cedar St', 'Dallas', 'TX', 'USA', '444-555-6666', false),
    ('Alexander Wilson', 37, 'alexander.wilson@example.com', '222 Birch St', 'San Diego', 'CA', 'USA', '555-666-7777', true),
    ('Ava Lopez', 23, 'ava.lopez@example.com', '333 Walnut St', 'Portland', 'OR', 'USA', '666-777-8888', true),
    ('David Moore', 38, 'david.moore@example.com', '444 Oak St', 'Atlanta', 'GA', 'USA', '777-888-9999', false),
    ('Sofia Perez', 24, 'sofia.perez@example.com', '555 Pine St', 'Las Vegas', 'NV', 'USA', '888-999-0000', true),
    ('Logan Gonzalez', 36, 'logan.gonzalez@example.com', '666 Elm St', 'Minneapolis', 'MN', 'USA', '999-000-1111', true),
    ('Benjamin Torres', 39, 'benjamin.torres@example.com', '777 Maple St', 'Detroit', 'MI', 'USA', '000-111-2222', false),
    ('Charlotte King', 21, 'charlotte.king@example.com', '888 Cedar St', 'Salt Lake City', 'UT', 'USA', '111-222-3333', true);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    order_date DATE,
    total_amount NUMERIC(10, 2),
    status VARCHAR(20)
);

-- Insert dummy data into orders table
INSERT INTO orders (user_id, order_date, total_amount, status)
VALUES
    (1, '2024-04-01', 100.50, 'Pending'),
    (2, '2024-04-02', 150.75, 'Shipped'),
    (3, '2024-04-03', 200.00, 'Delivered'),
    (4, '2024-04-04', 80.25, 'Pending'),
    (5, '2024-04-05', 120.00, 'Shipped'),
    (6, '2024-04-06', 175.50, 'Delivered'),
    (7, '2024-04-07', 95.75, 'Pending'),
    (8, '2024-04-08', 220.00, 'Shipped'),
    (9, '2024-04-09', 300.00, 'Delivered'),
    (10, '2024-04-10', 110.25, 'Pending'),
    (11, '2024-04-11', 95.50, 'Shipped'),
    (12, '2024-04-12', 125.75, 'Delivered'),
    (13, '2024-04-13', 180.00, 'Pending'),
    (14, '2024-04-14', 75.25, 'Shipped'),
    (15, '2024-04-15', 210.50, 'Delivered');

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    price NUMERIC(10, 2),
    stock_quantity INT
);

-- Insert dummy data into products table
INSERT INTO products (name, description, price, stock_quantity)
VALUES
    ('Laptop', 'Powerful laptop with high resolution display', 899.99, 50),
    ('Smartphone', 'Latest smartphone with advanced features', 699.99, 100),
    ('Tablet', 'Lightweight tablet for easy portability', 399.99, 75),
    ('Headphones', 'Premium headphones for immersive audio experience', 199.99, 200),
    ('Smartwatch', 'Elegant smartwatch with health tracking features', 299.99, 150),
    ('Digital Camera', 'Professional-grade digital camera for stunning photos', 799.99, 30),
    ('Bluetooth Speaker', 'Portable Bluetooth speaker with long battery life', 129.99, 100),
    ('Gaming Console', 'Next-generation gaming console for ultimate gaming experience', 499.99, 50),
    ('Fitness Tracker', 'Fitness tracker to monitor activity and health metrics', 149.99, 120),
    ('Wireless Earbuds', 'Wireless earbuds for music on the go', 149.99, 100),
    ('External Hard Drive', 'High-capacity external hard drive for data storage', 129.99, 80),
    ('Portable Charger', 'Portable charger for charging devices on the move', 49.99, 150),
    ('Coffee Maker', 'Automatic coffee maker for brewing delicious coffee', 79.99, 60),
    ('Toaster Oven', 'Versatile toaster oven for toasting and baking', 89.99, 40),
    ('Blender', 'Powerful blender for making smoothies and shakes', 59.99, 50),
    ('Air Fryer', 'Healthy air fryer for frying food with little to no oil', 129.99, 30),
    ('Vacuum Cleaner', 'Efficient vacuum cleaner for keeping your home clean', 199.99, 70),
    ('Smart Thermostat', 'Smart thermostat for controlling home temperature remotely', 179.99, 90),
    ('Security Camera', 'Wireless security camera for monitoring your home', 249.99, 40),
    ('Electric Toothbrush', 'Electric toothbrush for effective dental care', 99.99, 100);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    product_id INT REFERENCES products(product_id),
    quantity INT,
    unit_price NUMERIC(10, 2)
);

-- Insert dummy data into order_items table
INSERT INTO order_items (order_id, product_id, quantity, unit_price)
VALUES
    (1, 1, 2, 899.99),
    (1, 2, 1, 699.99),
    (2, 2, 3, 699.99),
    (3, 3, 2, 399.99),
    (4, 1, 1, 899.99),
    (4, 3, 2, 399.99),
    (5, 2, 2, 699.99),
    (5, 3, 3, 399.99),
    (6, 1, 3, 899.99),
    (6, 2, 1, 699.99),
    (7, 1, 2, 899.99),
    (7, 3, 1, 399.99),
    (8, 2, 2, 699.99),
    (8, 3, 3, 399.99),
    (9, 1, 3, 899.99),
    (9, 2, 2, 699.99),
    (10, 3, 1, 399.99),
    (10, 1, 2, 899.99),
    (11, 2, 3, 699.99),
    (11, 3, 1, 399.99),
    (12, 1, 1, 899.99),
    (12, 2, 2, 699.99),
    (13, 3, 2, 399.99),
    (13, 1, 3, 899.99),
    (14, 2, 1, 699.99),
    (14, 3, 3, 399.99),
    (15, 1, 2, 899.99),
    (15, 2, 2, 699.99);
