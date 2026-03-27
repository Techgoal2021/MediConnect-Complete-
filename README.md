# MediConnect: Inclusive Healthcare via Interswitch

**MediConnect** is an advanced medical consultation platform designed for the **Enyata-Interswitch Buildathon**. It bridges the gap between premium healthcare and financial inclusion by integrating simulated Interswitch WebPay and an innovative **"Low-Data USSD" Mode**.

## 🌟 Key Features

- **36+ Verified Specialists**: A vast network of seeded medical professionals across Cardiology, Pediatrics, Neurology, and more.
- **Interswitch WebPay Integration**: High-fidelity simulation of the Interswitch gateway, including real-time transaction verification.
- **"Pay with USSD" (Offline Mode)**: A groundbreaking accessibility feature allowing patients with low data to book appointments via transactional USSD codes.
- **AI-Powered Specialist Recommendations**: A Flask-based ML engine that recommends the correct medical department based on a patient's symptoms.
- **Smart Verification (Trust Scores)**: Real-time calculation of specialist reliability using historical ratings and consultation volume.
- **Sectors Served**: This solution directly addresses **Health (H)** and **Payment (P)** sectors of the Buildathon.

## 👥 Team Contributions & Roles

### 💻 Frontend Engineering (Lead: Egbujor Dominic Chikodi)
- **Tech Stack**: React.js, Tailwind CSS, Vite.
- **Accomplishments**: 
    - Developed the premium **"Medcare" Design System** using adaptive HSL palettes, glassmorphism, and custom UI components.
    - Implemented a **smooth, responsive appointment booking flow** with real-time feedback and state-persistent navigation.
    - Created the **"Master Switch" configuration** for seamless environment state management between local and production.
    - Optimized **Mobile Navigation & Accessibility**, ensuring a first-class experience for users on any device.
    - Engineered **Skeleton Loading states** to enhance perceived performance during complex Interswitch payment handshakes.

### ⚙️ Backend & Infrastructure (Lead: John Sowemimo)
- **Tech Stack**: Node.js, Express, JWT.
- **Accomplishments**:
    - Architected the core **Consultation Logic** and secure Specialist management endpoints.
    - Engineered a high-fidelity **Interswitch WebPay Simulation** for reliable transaction verification.
    - Designed the **Low-Data USSD Mode**, enabling offline healthcare access via simulated transactional codes.
    - Implemented **SHA-512 Secure Hash generation** for full compliance with Interswitch technical requirements.
    - Hardened the API against **Broken Object Level Authorization (BOLA)** to ensure patient data isolation.
    - Developed a **JSON-based persistent storage layer** for rapid synchronization and low-latency database operations.

### 🧬 Data Science & AI (Lead: Ernest Tashemi)
- **Tech Stack**: Python, Flask, Pandas.
- **Accomplishments**:
    - Developed the **Doctor Trust Rating System**: A complex algorithm that scores specialists from 0–100 based on patient reviews and ratings, displayed as "Trusted" or "Top Rated" labels in the UI.
    - Built the **Symptom-to-Specialist Recommendation Engine**: An NLP-driven model that suggests the correct medical department based on raw patient symptom descriptions.
    - Successfully integrated the Flask-based ML services into the Node.js backend to ensure high-speed, real-time data flow.

### 🛡️ Cybersecurity & Hardening (Lead: Uche Onyemali)
- **Focus**: Vulnerability Assessment & Compliance.
- **Accomplishments**:
    - **Reconnaissance & Asset Discovery**: Conducted strategic information gathering using **OWASP** methodology and **nmap** to map data flow and secure ports (Verified Port 8080, 5001, and 5173 exposure).
    - **Vulnerability Scanning**: Utilized **Nessus** to conduct deep scans and manual code audits. Identified and patched **Broken Object Level Authorization (BOLA)** vulnerabilities in payment verification routes.
    - **Authentication Hardening**: Verified password hashing logic (bcrypt) and tested the platform via **Auth0** patterns to ensure strict role-based isolation (Confirmed that patients cannot access other patients' private data).
    - **Reporting**: Provided a comprehensive [Vulnerability and Risk Report](file:///Users/user/.gemini/antigravity/scratch/SECURITY_REPORT.md) indicating architectural recommendations for long-term platform stability (Final Audit Status: SUCCESS 🛡️).

---

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
```bash
cd backend
npm install
npm start
```
- *Server runs on Port 8080*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- *App runs on Port 5173*

### 3. ML Service Setup (AI Engine)
```bash
cd backend/ml_service
pip install -r requirements.txt
python app.py
```
- *AI Engine runs on Port 5001*

---

## 🌍 Switching to Production (For Judges)

We have optimized the project for seamless deployment. The application now uses an **Automatic Master Switch**:

1.  **Local Dev**: Connects to `localhost:8080` and `localhost:5001` automatically.
2.  **Production**: Automatically detects the Vercel/Render environment and uses the `VITE_API_BASE_URL` environment variable.

No manual code changes are required to go live! Just set your environment variables in the Vercel/Render dashboard as described in the [Deployment Guide](file:///Users/user/.gemini/antigravity/scratch/DEPLOYMENT_GUIDE.md).

## 🏗️ Production Readiness & Scalability

MediConnect is built with a clear path to production. Significant enterprise patterns include:
- **Centralized Configuration**: All Interswitch-specific parameters (Merchant Code, Pay Item ID, Endpoint URLs) are abstracted into `frontend/src/config/interswitch.js`.
- **Environment Driven**: The application is ready to use `import.meta.env` for secure credential management in hosted environments (e.g., Vercel, AWS).
- **Graceful Failover**: The payment flow includes demo-safe failovers that ensure the user journey continues even in sandbox/testing environments.

## 📱 The "Buildathon Exclusive" USSD Feature
In the payment modal of any specialist, toggle to **"Pay with USSD"**. This generates a unique, simulated code for the transaction, demonstrating MediConnect's commitment to reaching patients in environments with poor data connectivity—a core value of financial inclusion.

**MediConnect: Making World-Class Healthcare Accessible to Everyone, Everywhere.**
