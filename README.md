# 🍽️ Recipe Hub

A full-stack recipe sharing and meal planning platform built with React, Redux Toolkit, TailwindCSS, and Node.js + Express + MongoDB. Users can create, rate, save, and comment on recipes, follow other users, and build weekly meal plans with embedded video tutorials.

## 🚀 Features

### 👤 Authentication & Profile
- JWT-based login, registration, and protected routes
- Forgot/reset password flow with email support
- Editable user profile with avatar and bio
- View other users and follow/unfollow them

### 📚 Recipes
- Create, update, delete recipes with ingredients, steps, image, and video
- Embed YouTube/Vimeo tutorials automatically
- Rate recipes (1–5 stars), like, save, and comment
- Search recipes by title, ingredients, or cuisine
- View saved and liked recipes

### 📅 Meal Planning
- Create weekly meal plans with selected recipes
- Update or delete plans
- View detailed plans with recipe previews
- Optional shopping list and notes support

### 💬 Social Interactions
- Follow/unfollow users
- Like and save recipes
- Comment on recipes
- View user dashboards with personal recipes and plans

## 🧱 Tech Stack

### Frontend
- React + Vite
- Redux Toolkit Query
- TailwindCSS
- React Router

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer for email
- RESTful API with modular controllers

## 📦 Installation

### Backend
- ```bash
- cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS, FRONTEND_URL
npm run dev

# Frontend
cd frontend
npm install
cp .env.example .env
# Set VITE_BASE_URL to your backend API
npm run dev


# 🔐 Environment Variables
- Key                   Desceiption
- MONGO_URI        -   MongoDB connection string
- JWT_SECRET       -   Secret for JWT token signing
- EMAIL_USER       -   Gmail address for sending emails
- EMAIL_PASS       -   Gmail app password or OAuth token
- FRONTEND_URL     -   URL used in reset password emails
- VITE_BASE_URL    -   Frontend base URL for API requests


# 🧪 API Overview
- POST /api/auth/register – Register new user
- POST /api/auth/login – Login
- POST /api/auth/forgot-password – Send reset link
- POST /api/auth/reset-password/:token – Reset password
- GET /api/profile/dashboard – Get user dashboard
- POST /api/recipes – Create recipe
- PATCH /api/recipes/:id – Update recipe
- GET /api/recipes/search?query= – Search recipes
- POST /api/mealplan – Create meal plan
- PUT /api/mealplan/:id – Update meal plan
- POST /api/social/follow/:id – Follow user
- POST /api/social/like/:id – Like recipe


# 🛡️ Security
- Passwords hashed with bcrypt
- JWT-based authentication
- Protected routes via middleware
- Token expiry and reset token validation


# 📸 Media Support
- Image upload via URL or base64
- Video embedding from YouTube/Vimeo
- Responsive iframe rendering


# 📈 Future Enhancements
- Role-based access control
- Advanced meal planning (multi-day, nutrition tracking)
- Notifications and activity feed
- Real-time comments or chat
- Mobile app integration

# 🧑‍💻 Author
Built by AMARNATH K — a resilient full-stack developer focused on clarity, modularity, and production readiness.



