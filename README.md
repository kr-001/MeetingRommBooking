# Mini Booking System for Meeting Rooms

## Introduction

This repository contains the source code and documentation for a small web application, the Mini Booking System for Meeting Rooms. This system is designed to facilitate the booking of available meeting rooms for specific time slots within a workday. It is built using Node.js for the backend and MongoDB for data operations, ensuring a robust and scalable solution.

## Features

### 1. Display Available Rooms

- List all available meeting rooms, each with a unique name or identifier.
- Users can view the current booking status for each room, helping them make informed decisions when booking a room.

### 2. Booking a Room

- Users can select a room and choose a time slot to book it.
- Time slots are available in increments of 30 minutes (e.g., 9:00-9:30, 9:30-10:00, etc.).
- Once a room is booked, the time slot is marked as unavailable for that specific room, preventing double bookings.

### 3. Viewing Bookings

- Users have the ability to view all of their current bookings.
- The view displays the room name and the booked time slot, making it easy for users to manage their reservations.

### 4. Editing and Canceling Bookings

- Users can modify the time of their booking or cancel it altogether.
- When a booking is canceled, the time slot becomes available for others to reserve, ensuring efficient room allocation.

## Getting Started

To run this application on your local machine, follow these steps:

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/mini-booking-system.git
   cd mini-booking-system
   ```

2. Install the necessary dependencies:

   ```bash
   npm install
   ```

3. Configure the MongoDB connection in the `config.js` file.

4. Start the Node.js server:

   ```bash
   npm start
   ```

5. Access the application in your web browser at `http://localhost:3000`.

## Technologies Used

- **Node.js**: Used for the backend server and business logic.
- **MongoDB**: Serves as the database for storing room booking data.
- **Express.js**: A web application framework for Node.js that simplifies routing and handling HTTP requests.
- **HTML/CSS**: Provides the front-end structure and styling.
- **Bootstrap**: Used for responsive and user-friendly design.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB, simplifying database interactions.
- **EJS**: A templating engine for rendering dynamic HTML content.

## Contributors

- [Your Name](https://github.com/kr-001)
## DUMMY LOGIN DETAILS:
- User1 , password1
- User2 , password2
