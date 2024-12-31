# Influencer Management System

Welcome to the Influencer Management System! 🎉 This is a full-stack web application built for managing influencers, their social media accounts, and assigning them to managers.

## Features
- Add, update, delete influencers and their social media accounts.
- Assign managers to influencers.
- Search influencers by name or filter by manager.
- Edit influencer details and dynamically add/remove social media accounts.
- A responsive UI built with React and TypeScript.
- Backend with Node.js, Express, and Prisma connected to a MongoDB database.

---

## Project Structure

```plaintext
InfluencerManagementSystem/
│
├── api/                 # Backend code
│   ├── prisma/          # Prisma schema and migration files
│   ├── src/             
│   │   ├── controllers/ # API controllers
│   │   ├── routes/      # API routes
│   │   ├── lib/         # Database connection (Prisma client)
│   │   ├── index.ts     # Entry point for the backend
│   │   └── .env         # Backend environment variables
│   └── package.json     # Backend dependencies
│
├── client/              # Frontend code
│   ├── src/             
│   │   ├── components/  # Reusable components (e.g., Button, ListRow)
│   │   ├── routes/      # Pages (e.g., ListPage, AddInfluencerPage)
│   │   ├── types/       # TypeScript types
│   │   ├── utils/       # Utility files (e.g., Axios instance)
│   │   └── .env         # Frontend environment variables
│   └── package.json     # Frontend dependencies
│
└── README.md            # Project overview
```
## Technologies Used

### Frontend
- React with TypeScript
- Vite for fast development
- SCSS for styling
- Axios for API calls

### Backend
- Node.js with TypeScript
- Express for API routing
- Prisma as an ORM
- MongoDB for the database
- dotenv for environment variable management
- Render for deployment

---

## Setup Guide

### 1. Clone the Repository
```bash
git clone https://github.com/mjarviste/InfluencerManagementSystem.git
cd InfluencerManagementSystem
```
### 2. Backend Setup
- Navigate to the `api` directory:
```bash
cd api
```
- Install dependencies:
```bash
npm install
```
- Set up the .env file:
```bash
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/influencer-management-system?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
NODE_ENV=dev
```
- Run the Prisma migration:
```bash
npx prisma migrate deploy
```
- Start the backend:
```bash
npm run dev
```
The backend will be running at http://localhost:3000.

### 3. Frontend Setup
- Navigate to the `client` directory:
```bash
cd client
```
- Install dependencies:
```bash
npm install
```
- Set up the .env file:
```bash
VITE_API_URL=http://localhost:3000
```
- Start the frontend development server:
```bash
npm run dev
```
The frontend will be running at http://localhost:5173.

## Deployment

### Frontend
- Deployed using Vercel. Make sure to set the `VITE_API_URL` environment variable to your backend's production URL.

### Backend
- Deployed using Render. Set the following environment variables:
  - `DATABASE_URL`: Your MongoDB connection string.
  - `CLIENT_URL`: Your frontend's production URL.
  - `NODE_ENV`: Make sure that it is set to `production`.

---

## Future Improvements
- Add pagination for large datasets.
- Implement authentication for secure access.
- Improve error handling and validation.
