# Car Rentals Management Dashboard

A comprehensive car rental management system built with Node.js, Express, MongoDB, and React. Features both admin dashboard functionality and API endpoints for modern web development.

## Features

- **React Frontend**: Modern, responsive dashboard with full CRUD operations
- **Express Backend**: RESTful API with comprehensive admin functionality  
- **MongoDB Atlas**: Cloud database for data persistence
- **Complete Management System**:
  - Vehicle Management (add, edit, delete vehicles)
  - Customer Management (manage customer profiles)
  - Rental Management (create and track bookings)
  - Real-time Dashboard with statistics
  - Auto-refresh functionality

## Technologies Used

- Node.js + Express.js
- MongoDB with Mongoose ODM
- React 18 (via CDN for rapid development)
- Pug template engine (admin backend)
- Custom CSS styling
- RESTful API architecture

## Project Structure

```
├── models/          # MongoDB schemas
├── routes/          # Express route handlers
├── views/           # Pug templates (admin)
├── public/          # Static files and React app
├── scripts/         # Database utilities
└── app.js          # Main server file
```

## API Endpoints

### Vehicles
- `GET /admin/api/vehicles` - Get all vehicles
- `POST /admin/vehicle` - Create new vehicle
- `PUT /admin/vehicle/:id` - Update vehicle
- `DELETE /admin/vehicle/:id` - Delete vehicle

### Customers  
- `GET /admin/api/customers` - Get all customers
- `POST /admin/customers` - Create new customer
- `PUT /admin/customers/:id` - Update customer
- `DELETE /admin/customers/:id` - Delete customer

### Rentals
- `GET /admin/api/rentals` - Get all rentals
- `POST /admin/rentals` - Create new rental

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   PORT=8888
   ```
4. Start the server: `node app.js`
5. Visit `http://localhost:8888` for React frontend
6. Visit `http://localhost:8888/admin/vehicles` for Pug admin

## Live Application

- **React Dashboard**: http://localhost:8888
- **Admin Backend**: http://localhost:8888/admin/vehicles

## Assignment Completion

Built for HTTP5222 Assignment 2 - React Frontend Development
- ✅ React-based frontend
- ✅ API integration with backend
- ✅ Professional styling and design
- ✅ Full CRUD functionality
- ✅ Responsive design
- ✅ Real-time data updates

## Deployment

Ready for deployment on platforms like Render, Heroku, or Vercel. The React frontend consumes the Express API endpoints for full functionality.
