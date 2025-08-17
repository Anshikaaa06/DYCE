# 🧠 Dyce Server

This is the **backend server for Dyce**, a private project using **Node.js**, **Express**, and **MongoDB** (via Mongoose). It provides a RESTful API with integrated **Swagger documentation**.

The frontend (built with **Next.js**) is located in a separate repository.

---

## 📦 Tech Stack

- **Node.js** + **Express** – Core server and routing
- **MongoDB** + **Mongoose** – Database and ODM
- **Swagger (OpenAPI)** – Auto-generated API documentation

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Dyce-App/dyce-server.git
cd dyce-server
```

### 2. Install dependencies

```bash
npm install
```

### 4. Run the server
**Development:**
```bash
npm run dev
```

## 📘 API Documentation
After starting the server, Swagger UI is available at:

```bash
http://localhost:3000/api-docs
```
Use it to explore and test API endpoints interactively.

## 📎 Related Repositories

- **Dyce Frontend** → [dyce-client](https://github.com/Dyce-Dating-App/dyce-client)


## Environment Setip

This server supports environment-specific configuration via ```NODE_ENV```.



| Environment | File User  |
| :-------- | :------- |
| development | `.env.development` | 
| production | `.env.production` | 
| (fallback) | `.env` | 

Handled in ```server.js```

```javascript
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
dotenv.config({ path: '.env' }); // fallback
```