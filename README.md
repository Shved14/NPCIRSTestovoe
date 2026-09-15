# NPCIRS Fullstack Test Assignment

Fullstack-приложение для управления **покупателями и заказами**, выполненное в рамках тестового задания.

Проект состоит из:

- клиентской части на **React**;
- REST API на **Node.js / Express**;
- базы данных **PostgreSQL**;
- ORM **Sequelize**;
- таблиц **AG Grid**;
- серверной частичной загрузки данных через SQL `LIMIT` / `OFFSET`.

## Функциональность

В приложении реализованы две связанные сущности:

- **Customers** — покупатели;
- **Orders** — заказы.

Основные возможности:

- просмотр списка покупателей;
- добавление, редактирование и удаление покупателей;
- просмотр списка заказов;
- добавление, редактирование и удаление заказов;
- привязка заказа к существующему покупателю через foreign key;
- подтверждение удаления записей;
- обработка ошибок API;
- Валидация пользовательского ввода выполняется на frontend и дополнительно проверяется на backend.
- частичная загрузка покупателей через **AG Grid Infinite Row Model**;
- REST API с CRUD-операциями;
- централизованная обработка ошибок на сервере.

---

## Стек

### Frontend

- React 19
- React Router
- Vite 8
- AG Grid 36
- Axios
- Oxlint

### Backend

- Node.js
- Express 5
- Sequelize 6
- PostgreSQL (`pg`)
- express-validator
- Helmet
- CORS
- express-rate-limit
- dotenv

### Database

- PostgreSQL
- SQL-скрипт инициализации `init-db.sql`

---

## Структура проекта

```text
NPCIRSTestovoe/
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── CustomersTable.jsx
│   │   │   └── OrdersTable.jsx
│   │   ├── layout/
│   │   │   └── Layout.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── utils/
│   │   │   └── apiError.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── customersController.js
│   │   │   └── ordersController.js
│   │   ├── db/
│   │   │   └── db.js
│   │   ├── error/
│   │   │   └── ApiError.js
│   │   ├── middleware/
│   │   │   ├── ErrorHandlingMiddleware.js
│   │   │   ├── notFoundMiddleware.js
│   │   │   └── validationMiddleware.js
│   │   ├── models/
│   │   │   ├── customersModel.js
│   │   │   ├── models.js
│   │   │   └── ordersModel.js
│   │   ├── routes/
│   │   │   ├── customersRoutes.js
│   │   │   ├── ordersRoutes.js
│   │   │   └── index.js
│   │   └── validation/
│   │       ├── customersValidation.js
│   │       └── ordersValidation.js
│   ├── .env.example
│   ├── app.js
│   ├── index.js
│   └── package.json
│
├── init-db.sql
├── .gitignore
└── README.md
```

Backend разделён по слоям:

```text
Routes
  ↓
Controllers
  ↓
Models / Data Access
  ↓
Sequelize / Raw SQL
  ↓
PostgreSQL
```

---

## Схема базы данных

В проекте используются две связанные таблицы.

### `customers`

| Поле | Тип | Описание |
|---|---|---|
| `id` | INTEGER | Primary key, identity |
| `name` | VARCHAR(30) | Имя покупателя |
| `registered_on` | DATE | Дата регистрации |
| `credit_limit` | NUMERIC(10,2) | Кредитный лимит |
| `priority` | INTEGER | Приоритет |

### `orders`

| Поле | Тип | Описание |
|---|---|---|
| `id` | INTEGER | Primary key, identity |
| `customer_id` | INTEGER | Foreign key на `customers.id` |
| `title` | VARCHAR(200) | Название заказа |
| `order_date` | DATE | Дата заказа |
| `amount` | NUMERIC(10,2) | Сумма заказа |
| `quantity` | INTEGER | Количество |

Связь между таблицами:

```text
customers (1) ─────────────── (N) orders
     id        ← customer_id
```

Foreign key настроен следующим образом:

```sql
FOREIGN KEY (customer_id)
REFERENCES customers(id)
ON UPDATE CASCADE
ON DELETE RESTRICT
```

Это предотвращает появление заказов без существующего покупателя и не позволяет удалить покупателя, пока у него есть связанные заказы.

Также для `orders.customer_id` создаётся индекс:

```sql
CREATE INDEX idx_orders_customer_id
ON orders(customer_id);
```

---

## Требования

Для локального запуска необходимы:

- **Node.js 20.19+** или **Node.js 22.12+**;
- npm;
- PostgreSQL;
- `psql` в PATH — желательно для запуска SQL-скрипта из терминала.

---

# Установка и запуск

## 1. Клонирование репозитория

```bash
git clone <repository-url>
cd NPCIRSTestovoe
```

## 2. Создание PostgreSQL database

Создайте отдельную базу данных, например:

```bash
psql -U postgres -c "CREATE DATABASE npcirs_test;"
```

После этого примените SQL-скрипт из корня проекта:

```bash
psql -U postgres -d npcirs_test -f init-db.sql
```

`init-db.sql`:

- удаляет существующие таблицы `orders` и `customers`, если они существуют;
- создаёт обе таблицы;
- создаёт foreign key;
- создаёт индекс;
- добавляет тестовые данные.

> Важно: повторный запуск `init-db.sql` пересоздаёт таблицы и удаляет данные, которые были добавлены после предыдущей инициализации.

## 3. Настройка backend

Перейдите в директорию сервера:

```bash
cd server
```

Установите зависимости:

```bash
npm ci
```

Создайте `.env` на основе `.env.example`.

Пример:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=npcirs_test
DB_USER=postgres
DB_PASSWORD=your_password

CLIENT_URL=http://localhost:5173
```

Запуск backend в development-режиме:

```bash
npm run dev
```

Обычный запуск:

```bash
npm start
```

API будет доступен по адресу:

```text
http://localhost:5000/api
```

## 4. Настройка frontend

Откройте второй терминал и перейдите в директорию клиента:

```bash
cd client
```

Установите зависимости:

```bash
npm ci
```

Создайте `.env` на основе `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

Запустите frontend:

```bash
npm run dev
```

При стандартной конфигурации приложение будет доступно по адресу:

```text
http://localhost:5173
```

---

# REST API

Базовый URL:

```text
http://localhost:5000/api
```

## Customers

| Метод | Endpoint | Описание |
|---|---|---|
| `GET` | `/customers` | Получить список покупателей |
| `GET` | `/customers/:id` | Получить покупателя по ID |
| `POST` | `/customers` | Создать покупателя |
| `PUT` | `/customers/:id` | Изменить покупателя |
| `DELETE` | `/customers/:id` | Удалить покупателя |

Пример списка:

```http
GET /api/customers?limit=15&offset=0
```

Ответ:

```json
{
  "rows": [
    {
      "id": 1,
      "name": "Иван Петров",
      "registered_on": "2026-08-15",
      "credit_limit": "50000.00",
      "priority": 1
    }
  ],
  "total": 5
}
```

Создание:

```json
{
  "name": "Иван Петров",
  "registered_on": "2026-08-15",
  "credit_limit": 50000,
  "priority": 1
}
```

## Orders

| Метод | Endpoint | Описание |
|---|---|---|
| `GET` | `/orders` | Получить список заказов |
| `GET` | `/orders/:id` | Получить заказ по ID |
| `POST` | `/orders` | Создать заказ |
| `PUT` | `/orders/:id` | Изменить заказ |
| `DELETE` | `/orders/:id` | Удалить заказ |

Пример:

```http
GET /api/orders?limit=100&offset=0
```

Создание заказа:

```json
{
  "customer_id": 1,
  "title": "Ноутбук",
  "order_date": "2026-08-16",
  "amount": 85000,
  "quantity": 1
}
```

`customer_id` должен ссылаться на существующего покупателя.

---

# AG Grid Infinite Row Model

Для основной таблицы **Customers** используется **AG Grid Infinite Row Model**:

```jsx
rowModelType="infinite"
cacheBlockSize={15}
maxBlocksInCache={5}
```

AG Grid передаёт datasource:

```text
startRow
endRow
```

На клиенте вычисляются:

```js
const limit = endRow - startRow
const offset = startRow
```

После этого выполняется запрос:

```http
GET /api/customers?limit=<limit>&offset=<offset>
```

Backend использует параметры в SQL:

```sql
SELECT
    id,
    name,
    registered_on,
    credit_limit,
    priority
FROM customers
ORDER BY id ASC
LIMIT :limit
OFFSET :offset;
```

Общее количество строк определяется отдельным запросом:

```sql
SELECT COUNT(*) AS total
FROM customers;
```

Backend возвращает:

```json
{
  "rows": [],
  "total": 0
}
```

AG Grid получает результат через:

```js
successCallback(rows, total)
```

После создания, изменения или удаления покупателя вызывается:

```js
refreshInfiniteCache()
```

Таким образом Customers загружаются частями с сервера, а не целиком.

---

# Sequelize и Raw SQL

В проекте используются как стандартные методы Sequelize, так и `sequelize.query()`.

Примеры Sequelize methods:

```js
Customers.create(...)
Customers.findByPk(...)
Orders.findAndCountAll(...)
Orders.findByPk(...)
order.save()
order.destroy()
```

Raw SQL через `sequelize.query()` используется, в частности, для:

- выборки Customers с `LIMIT` / `OFFSET`;
- `COUNT(*)` покупателей;
- UPDATE покупателей;
- DELETE покупателей;
- INSERT заказа;
- получения заказа по ID.

Пользовательские значения передаются через `replacements`.

---

# Валидация и обработка ошибок

Backend использует `express-validator`.

Проверяются:

- ID;
- `limit` / `offset`;
- обязательные поля;
- строки и их длина;
- даты;
- integer;
- decimal;
- отрицательные значения.

На сервере также реализована централизованная обработка ошибок.

Основные HTTP-коды:

| Код | Назначение |
|---|---|
| `200` | Успешный запрос |
| `201` | Запись создана |
| `204` | Запись удалена |
| `400` | Некорректный запрос |
| `404` | Ресурс не найден |
| `409` | Конфликт данных |
| `500` | Внутренняя ошибка сервера |

---

# Безопасность

Backend использует:

- `helmet`;
- CORS с `CLIENT_URL`;
- `express-rate-limit`;
- JSON body limit `100kb`;
- отключённый `X-Powered-By`;
- параметризованные raw SQL queries;
- backend validation;
- централизованную обработку ошибок.

Файлы `.env` не должны попадать в Git. В репозитории следует хранить только `.env.example`.

---

# NPM scripts

## Server

```bash
npm run dev
```

Development-запуск через Nodemon.

```bash
npm start
```

Обычный запуск Node.js.

## Client

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

---

# Environment variables

## Server

| Переменная | Описание | Пример |
|---|---|---|
| `PORT` | Порт API | `5000` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Название базы | `npcirs_test` |
| `DB_USER` | Пользователь PostgreSQL | `postgres` |
| `DB_PASSWORD` | Пароль PostgreSQL | `password` |
| `CLIENT_URL` | Разрешённый frontend origin | `http://localhost:5173` |

## Client

| Переменная | Описание | Пример |
|---|---|---|
| `VITE_API_URL` | URL backend API | `http://localhost:5000/api` |

---

# Особенности реализации

- База и тестовые данные инициализируются через `init-db.sql`.
- `sequelize.sync()` не используется.
- Sequelize models соответствуют таблицам `customers` и `orders`.
- Между моделями настроены `belongsTo` / `hasMany`.
- Foreign key использует `ON DELETE RESTRICT` и `ON UPDATE CASCADE`.
- REST routes, controllers и models разделены.
- Customers используют серверный Infinite Loading.
- Raw SQL параметризован.
- При `SIGINT` / `SIGTERM` сервер закрывает HTTP server и соединение Sequelize.

---
# Быстрый запуск
PostgreSQL

```Создайте базу данных:

psql -U postgres -c "CREATE DATABASE npcirs_test;"
```

```Затем выполните SQL-скрипт:

psql -U postgres -d npcirs_test -f init-db.sql
```
#Windows
Если команда psql не распознаётся, используйте полный путь к psql.exe:
```
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE npcirs_test;"
```
#Для выполнения init-db.sql:
```
$env:PGCLIENTENCODING="UTF8"
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -d npcirs_test -f .\init-db.sql
```
#Путь к psql.exe зависит от установленной версии PostgreSQL. Например, для PostgreSQL 17 путь будет C:\Program Files\PostgreSQL\17\bin\psql.exe.

#Если при выполнении init-db.sql возникает ошибка кодировки WIN1251 / UTF8, установите PGCLIENTENCODING=UTF8 перед запуском SQL-скрипта.

# Backend
cd server
npm ci
# создать server/.env
npm run dev
```

В отдельном терминале:

```bash
cd client
npm ci
# создать client/.env
npm run dev
```

Адреса по умолчанию:

```text
Frontend: http://localhost:5173
API:      http://localhost:5000/api
```

---

## Соответствие тестовому заданию

В проекте реализованы ключевые требования задания:

- PostgreSQL;
- две связанные таблицы;
- `NUMERIC`, `VARCHAR`, `DATE`, `INTEGER`;
- foreign key;
- `init-db.sql` с таблицами и seed data;
- Node.js / Express;
- Sequelize;
- использование `sequelize.query()`;
- REST CRUD;
- структура `models / controllers / routes`;
- React Dashboard;
- две таблицы AG Grid;
- CRUD для связанных данных;
- AG Grid Infinite Row Model;
- server-side partial loading;
- SQL `LIMIT` / `OFFSET`;
- отдельные `/client` и `/server`.
