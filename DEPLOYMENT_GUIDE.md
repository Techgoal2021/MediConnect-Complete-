# MediConnect: Live Deployment Guide 🚀

Follow these steps to get your Buildathon MVP live on the internet! 🏁🏆

## 1. Backend & AI Engine (Render)
Head over to [Render.com](https://render.com) and connect your GitHub repo.

### A. ML Service (Flask)
- **Service Type**: Web Service
- **Root Directory**: `backend/ml_service`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`
- **Link**: Copy the URL (e.g., `https://mediconnect-ai.onrender.com`)

### B. Backend API (Node.js)
- **Service Type**: Web Service
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
    - `ML_SERVICE_URL`: [Your AI Engine URL from Step A]
    - `PORT`: `8080` (or leave empty for Render default)
- **Link**: Copy the URL (e.g., `https://mediconnect-api.onrender.com`)

---

## 2. Frontend (Vercel)
Head to [Vercel.com](https://vercel.com) and import your repo.

- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
    - `VITE_API_BASE_URL`: [Your Backend API URL from Step 1B]

---

## 3. The "Master Link"
Once Vercel finishes, your site will be live at:  
**https://mediconnect-app.vercel.app**

**Note**: Remember that because we are using a JSON Database, your data will reset if the Render server restarts! This is perfect for a clean demo. 🚀🏁🏆
