# Instagram Influencer Analytics Dashboard

A full-stack web application designed to scrape, analyze, and display profile data and engagement metrics for any public Instagram influencer, featuring AI-powered content analysis.

## ✨ Features

- **Profile Scraping:** Fetches key profile data including follower/following counts, post counts, bio, and verification status
- **Engagement Analytics:** Automatically calculates average likes, average comments, and engagement rate based on recent posts
- **AI-Powered Tagging:** Uses the Clarifai API to perform image recognition, generating relevant tags and a "vibe" for each post and reel
- **Data Visualization:** Displays key metrics and performance trends using interactive charts
- **Persistent Caching:** Caches AI analysis results in the database to improve performance and reduce redundant API calls on subsequent requests

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Material-UI (MUI)

### Backend
- Node.js
- Express.js

### Database
- MongoDB with Mongoose

### AI Analysis
- Clarifai API

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **MongoDB** instance (local or cloud service like MongoDB Atlas)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/sobhit-raghav/instagram-influencer-analytics.git
cd instagram-influencer-analytics
```

### 2. Backend Setup

Navigate to the backend directory and install the necessary dependencies.

```bash
cd backend
npm install
```

### 3. Frontend Setup

Navigate to the frontend directory and install its dependencies.

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following configuration:

```env
# Server Configuration
PORT=8080
DEBUG=false # Set to true for logging

# MongoDB Connection String
MONGO_URI="YOUR_MONGODB_CONNECTION_STRING"

# Node Environment
NODE_ENV=development # Change to 'production' in a production environment 

# Clarifai API Credentials
CLARIFAI_API_KEY="YOUR_CLARIFAI_API_KEY"
CLARIFAI_USER_ID="YOUR_CLARIFAI_USER_ID"
CLARIFAI_APP_ID="YOUR_CLARIFAI_APP_ID"
```

### Getting Clarifai Credentials

1. Sign up for a free "Community" account at [Clarifai](https://www.clarifai.com/)
2. Create a new application in your dashboard
3. Navigate to your application's settings
4. Copy the following values:
   - **API Key**
   - **User ID**
   - **App ID**
5. Paste these values into your `.env` file

### MongoDB Setup

**Option 1: Local MongoDB**
- Install MongoDB locally and use `mongodb://localhost:27017/instagram-analytics`

**Option 2: MongoDB Atlas (Recommended)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `YOUR_MONGODB_CONNECTION_STRING` in the `.env` file

## 🏃 Running the Application

You need to run both the backend and frontend servers concurrently in separate terminal windows.

### Terminal 1: Start the Backend Server

```bash
cd backend
npm run dev
```

The API server will start on `http://localhost:8080`.

### Terminal 2: Start the Frontend Server

```bash
cd frontend
npm run dev
```

The React development server will start on `http://localhost:5173`

Your browser should automatically open to the application. If not, navigate to `http://localhost:5173` manually.

## 🔄 How It Works

1. **Profile Fetching:** When a username is submitted, the backend makes a direct API call to a public Instagram endpoint to fetch the user's profile data and recent media list

2. **Data Enrichment:** The backend makes secondary API calls to get accurate like/comment counts for all media types, including carousels

3. **AI Analysis:** For each new post or reel, the backend calls the Clarifai API to perform image analysis, generating:
   - Relevant tags
   - Content "vibe"
   - Detected events

4. **Caching:** Analysis data is cached in MongoDB. On future requests for the same user, the backend reuses saved analysis data instead of making redundant Clarifai API calls

5. **Visualization:** The complete, enriched data is sent to the frontend and displayed in a responsive dashboard with interactive charts