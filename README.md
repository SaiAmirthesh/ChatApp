# Real-Time Chat Application (Spring Boot + WebSocket + React)

This project is a full-stack real-time chat application built using Spring Boot, WebSocket (STOMP), React, PostgreSQL, and Docker. The application supports real-time messaging, message persistence, and cloud deployment.

This project demonstrates real-time system design, REST and WebSocket integration, database persistence, containerization, and cloud deployment.

---

# Features

* Real-time messaging using WebSocket (STOMP)
* Join and Leave notifications
* Message persistence using PostgreSQL
* Load previous chat history using REST API
* Dockerized backend service
* Cloud deployment (Render/Railway)
* React frontend
* Environment variable based configuration

---

# System Architecture

```
Users
  |
  v
React Frontend
  |
  | REST API (Load chat history)
  | WebSocket (Real-time messaging)
  |
Spring Boot Backend
  |
  | JPA / Hibernate
  |
PostgreSQL Database
```

Architecture Pattern: REST + WebSocket Hybrid Architecture (used in real-time systems like Slack, Discord, WhatsApp Web).

---

# Tech Stack

| Layer                   | Technology        |
| ----------------------- | ----------------- |
| Frontend                | React             |
| Backend                 | Spring Boot       |
| Real-time Communication | WebSocket + STOMP |
| API                     | REST              |
| Database                | PostgreSQL        |
| ORM                     | JPA / Hibernate   |
| Build Tool              | Maven             |
| Containerization        | Docker            |
| Deployment              | Render / Railway  |
| Frontend Hosting        | Vercel            |

---

# API Endpoints

## REST API

| Method | Endpoint           | Description           |
| ------ | ------------------ | --------------------- |
| GET    | /api/chat/messages | Get all chat messages |

## WebSocket Endpoints

| Endpoint              | Description                   |
| --------------------- | ----------------------------- |
| /ws                   | WebSocket connection endpoint |
| /app/chat.sendMessage | Send message                  |
| /app/chat.addUser     | Join chat                     |
| /topic/public         | Subscribe to messages         |

---

# Local Setup Instructions

## Clone Repository

```
git clone https://github.com/yourusername/ChatApp.git
cd ChatApp
```

## Backend Setup

```
cd backend
mvn clean package
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

## Frontend Setup

```
cd frontend
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

# Running Backend with Docker

```
cd backend
docker build -t chatapp-backend .
docker run -p 8080:8080 \
-e DB_URL=your_db_url \
-e DB_USERNAME=your_db_username \
-e DB_PASSWORD=your_db_password \
chatapp-backend
```

---

# Deployment

| Service   | Platform         |
| --------- | ---------------- |
| Frontend  | Vercel           |
| Backend   | Render           |
| Database  | Neon PostgreSQL  |
| Container | Docker           |

---

# Future Improvements

* JWT Authentication
* Private messaging
* Online users presence system
* Typing indicator
* Message read receipts
* Redis for presence tracking
* RabbitMQ for message broker
* Docker Compose
* Kubernetes deployment

---

# What This Project Demonstrates

* Real-time communication using WebSocket
* Publish-Subscribe architecture
* REST and WebSocket hybrid system
* Full-stack development (React + Spring Boot)
* Database persistence with PostgreSQL
* Docker containerization
* Cloud deployment
* Environment-based configuration

---


