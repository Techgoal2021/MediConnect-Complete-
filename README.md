# MediConnect: Inclusive Healthcare via Interswitch

**MediConnect** is an advanced medical consultation platform designed for the **Enyata-Interswitch Buildathon**. It bridges the gap between premium healthcare and financial inclusion by integrating simulated Interswitch WebPay and an innovative **"Low-Data USSD" Mode**.

## 🌟 Key Features

- **36+ Verified Specialists**: A vast network of seeded medical professionals across Cardiology, Pediatrics, Neurology, and more.
- **Interswitch WebPay Integration**: High-fidelity simulation of the Interswitch gateway, including real-time transaction verification.
- **"Pay with USSD" (Offline Mode)**: A groundbreaking accessibility feature allowing patients with low data to book appointments via transactional USSD codes.
- **Sectors Served**: This solution directly addresses **Health (H)** and **Payment (P)** sectors of the Buildathon.

## 🔐 Test Credentials

For judge review and testing, please use the following verified credentials:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Patient** | `john.doe@example.com` | `password123` | 
| **Specialist** | `smith@medicare.com` | `password123` |
| **Admin** | `admin@mediconnect.com` | `admin123` |

## 🛠️ Technology Stack

- **Frontend**: React.js with Tailwind CSS (Vite)
- **Backend**: Node.js & Express
- **Database**: Simulated JSON-based persistence (Buildathon Ready)
- **Integrations**: Mock Interswitch Identity & Payment Gateways

## 🚀 Quick Start (Local Development)

Because we have optimized the project for submission, follow these steps to run it locally:

### 1. Backend Setup
1. Open a terminal in the `backend/` folder.
2. Run **`npm install`** (to restore dependencies).
3. Run **`npm start`**.
   -   *The backend will run on Port 5000.*

### 2. Frontend Setup
1. Open a second terminal in the `frontend/` folder.
2. Run **`npm install`**.
3. Run **`npm run dev`**.
   -   *The frontend will run on Port 5173.*

---

## 🌍 Switching to Production (For Judges)

We have centralized all API communication for easy deployment. To point the Frontend to a live hosted Backend (e.g., on Render):

1.  Open **`frontend/src/config/api.js`**.
2.  Change `const ENVIRONMENT = "local"` to **`"production"`**.
3.  Update the `production.API_BASE_URL` with your live Render URL.

This "Master Switch" pattern ensures your project works flawlessly in any environment.

## 🏗️ Production Readiness & Scalability

MediConnect is built with a clear path to production. Significant enterprise patterns include:
- **Centralized Configuration**: All Interswitch-specific parameters (Merchant Code, Pay Item ID, Endpoint URLs) are abstracted into `frontend/src/config/interswitch.js`.
- **Environment Driven**: The application is ready to use `import.meta.env` for secure credential management in hosted environments (e.g., Vercel, AWS).
- **Graceful Failover**: The payment flow includes demo-safe failovers that ensure the user journey continues even in sandbox/testing environments.

## 📱 The "Buildathon Exclusive" USSD Feature
In the payment modal of any specialist, toggle to **"Pay with USSD"**. This generates a unique, simulated code for the transaction, demonstrating MediConnect's commitment to reaching patients in environments with poor data connectivity—a core value of financial inclusion.

**MediConnect: Making World-Class Healthcare Accessible to Everyone, Everywhere.**
