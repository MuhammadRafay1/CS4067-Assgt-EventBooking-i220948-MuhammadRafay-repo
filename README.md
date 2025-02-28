# 🚀 Microservices-Based Event Booking Platform

![Event Booking System](https://img.shields.io/badge/Event--Booking-Microservices-blue.svg) ![Status](https://img.shields.io/badge/Status-Active-green.svg) ![License](https://img.shields.io/badge/License-MIT-yellow.svg)

Welcome to the **Microservices-Based Event Booking Platform**! 🎟️ This project provides a scalable and efficient system for **browsing events, booking tickets, and receiving real-time notifications**. Built using **Node.js, PostgreSQL, and microservices architecture**, this system ensures smooth and optimized event management.

## 📌 **Project Overview**
This platform consists of multiple microservices to handle different functionalities:

- **User Service**: Manages authentication and user profiles.
- **Event Service**: Handles event listings and details.
- **Booking Service**: Manages ticket bookings, payments, and status updates.
- **Notification Service**: Sends real-time email/SMS confirmations.

> **Integration:** The system uses **Jira for issue tracking** and **GitHub for version control**.

## 🛠 **Tech Stack**
| Component      | Technology Stack |
|--------------|----------------|
| Backend | Node.js, Express.js, Sequelize |
| Database | PostgreSQL |
| Messaging Queue | RabbitMQ |
| API Documentation | Swagger / OpenAPI |
| Authentication | JWT (JSON Web Token) |
| Version Control | Git & GitHub |

## 📂 **Project Structure**
```
backend/
├── user-service/        # Authentication & profiles
├── event-service/       # Event management
├── booking-service/     # Ticket bookings & payments
├── notification-service # Email/SMS notifications
frontend/                # v0-based frontend
```

## ⚙️ **Installation & Setup**
### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-username/CS4067-EventBooking.git
cd CS4067-EventBooking
```
### **2️⃣ Install Backend Dependencies**
```bash
cd backend/user-service  # Repeat for other services
npm install
```
### **3️⃣ Setup PostgreSQL Database**
```sql
CREATE DATABASE event_booking;
CREATE USER event_user WITH PASSWORD 'securepassword';
GRANT ALL PRIVILEGES ON DATABASE event_booking TO event_user;
```

### **4️⃣ Configure Environment Variables**
Create a `.env` file in each service and add:
```
DATABASE_URL=postgres://event_user:securepassword@localhost:5432/event_booking
PORT=4001
JWT_SECRET=your_secret_key
```

### **5️⃣ Start Services**
```bash
node server.js  # Inside each microservice folder
```

## 🔗 **API Endpoints**
### **User Service**
| Method | Endpoint | Description |
|--------|----------|------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive a JWT token |

### **Booking Service**
| Method | Endpoint | Description |
|--------|----------|------------|
| POST | `/bookings` | Create a new booking |
| GET | `/bookings/:id` | Fetch booking details |

### **Notification Service**
| Method | Endpoint | Description |
|--------|----------|------------|
| POST | `/notify` | Send confirmation notification |

## 🏗 **Contributing**
Contributions are welcome! Please follow these steps:
1. Fork the repository 📌
2. Create a new branch (`feature/amazing-feature`) 🛠
3. Commit your changes (`git commit -m 'Add amazing feature'`) 💡
4. Push to the branch (`git push origin feature/amazing-feature`) 🚀
5. Open a Pull Request! 🎉


**📌 Star this repo ⭐ if you find it useful!** 🎉

