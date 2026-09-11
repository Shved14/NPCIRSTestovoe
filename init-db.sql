
ПЕРЕПЕЧАТАТЬ
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;


CREATE TABLE customers (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    name VARCHAR(30) NOT NULL,

    registered_on DATE NOT NULL,

    credit_limit NUMERIC(10, 2) NOT NULL
        CHECK (credit_limit >= 0)
);


CREATE TABLE orders (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    customer_id INTEGER NOT NULL,

    title VARCHAR(200),

    order_date DATE NOT NULL,

    amount NUMERIC(10, 2) NOT NULL
        CHECK (amount >= 0),

    quantity INTEGER NOT NULL DEFAULT 0
        CHECK (quantity >= 0),

    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);


INSERT INTO customers (name, registered_on, credit_limit)
VALUES
    ('Иван Петров', '2026-08-15', 50000.00),
    ('Анна Смирнова', '2026-08-20', 75000.00),
    ('Дмитрий Иванов', '2026-08-25', 100000.00),
    ('Елена Кузнецова', '2026-09-01', 30000.00),
    ('Алексей Соколов', '2026-09-05', 120000.00);


INSERT INTO orders (
    customer_id,
    title,
    order_date,
    amount,
    quantity
)
VALUES
    (1, 'Ноутбук', '2026-08-16', 85000.00, 1),
    (1, 'Мышь', '2026-08-17', 2500.00, 2),

    (2, 'Монитор', '2026-08-21', 35000.00, 1),
    (2, 'Клавиатура', '2026-08-22', 7500.00, 1),

    (3, 'Смартфон', '2026-08-26', 65000.00, 1),
    (3, 'Наушники', '2026-08-27', 12000.00, 2),

    (4, 'Принтер', '2026-09-02', 18000.00, 1),

    (5, 'Монитор', '2026-09-06', 45000.00, 2),
    (5, 'Веб-камера', '2026-09-07', 6500.00, 1);