# Instagram Influencer Analytics Dashboard

A full-stack web application designed to scrape and display profile data for any public Instagram influencer.

## Tech Stack

- **Frontend:** React, Vite, Material-UI (MUI), Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Scraping:** Puppeteer

---

## Setup and Installation

### Prerequisites

- Node.js
- npm or yarn
- MongoDB

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

Next, create a `.env` file in the backend directory. This file is crucial for storing your environment variables.

Open the `.env` file and add the following configuration. You must use a test/burner Instagram account for the credentials.

```env
# Server Configuration
PORT=8080
DEBUG=false # Set to true for logging

# Node Environment
NODE_ENV=development # Change to 'production' in a production environment 

# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/influencerDB

# Instagram Scraper Credentials (USE A TEST ACCOUNT)
INSTAGRAM_BASE_URL=https://www.instagram.com
INSTAGRAM_USER="your_test_instagram_username"
INSTAGRAM_PASS="your_test_instagram_password"
```

### 3. Frontend Setup

Navigate to the frontend directory and install its dependencies.

```bash
cd ../frontend
npm install
```

The frontend is configured to connect to the backend at `http://localhost:8080` by default.

## Running the Application

To run the application, you will need to have both the backend and frontend servers running concurrently in two separate terminal windows.

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

The React development server will start, and your application will open in a browser window, typically at `http://localhost:5173`.

## Usage

1. Open your browser and navigate to the frontend URL (usually `http://localhost:5173`)
2. Enter an Instagram username in the search field
3. The application will scrape and display the influencer's profile data, including recent posts and reels
4. Click on any post or reel card to view the original content on Instagram

## Important Notes

- **Use a Test Account:** Always use a burner/test Instagram account for scraping credentials. Never use your personal account.