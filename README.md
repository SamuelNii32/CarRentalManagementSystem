# Car Rentals Dashboard

This is a Node.js Express web application with MongoDB that serves as an **Admin Dashboard** for managing car rentals. The app includes admin pages for managing Cars, Customers, and Rentals and exposes a JSON API for future public-facing integration.

## 📁 Features

- Admin Dashboard built with Express and Pug
- MongoDB Atlas for data persistence
- Manage:
  - 🚗 Vehicles (add, edit, delete)
  - 👤 Customers (add, edit, delete)
  - 📄 Rentals (create, view, delete)
- JSON API Endpoints for all collections
- Responsive design using a custom-styled CSS framework
- Fully deployed and publicly accessible

## 🧪 Technologies Used

- Node.js + Express
- MongoDB (via Mongoose)
- Pug template engine
- Bootstrap (customized)
- Render (deployment)

## 🔐 Environment Variables

In a local `.env` file (excluded from repo), add:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=8888

🚀 Deployment
This app is deployed live on Render:

🔗 Live Admin Dashboard

https://carrentalmanagementsystem-vufm.onrender.com



🛠️ How to Run Locally
Clone the repository:


git clone https://github.com/yourusername/CarRentalManagementSystem.git
cd CarRentalManagementSystem
Install dependencies:

bash
npm install
Create a .env file and add your MongoDB URI:
MONGODB_URI=your_mongodb_uri
PORT=8888
Start the server:

node app.js
Visit http://localhost:8888 in your browser.
