# Train Booking System - Frontend Implementation Guide

<<<<<<< HEAD
# Evolvifiers Train Booking System

## Overview

![alt text](./images/Evolvifiers.drawio.svg)

This codebase is a microservices architecture for a train booking system. It consists of several services, each responsible for different functionalities, and they communicate with each other using RabbitMQ for message queuing. The services are:

1. **Auth Service**: Manages user authentication and authorization.
2. **Train Service**: Handles train-related data and operations.
3. **Booking Service**: Manages booking operations and interactions with the payment service.
4. **Payment Service**: Processes payments and sends notifications.
5. **API Gateway**: Acts as a single entry point for client requests, routing them to the appropriate services.

## Services

### Auth Service

- **Purpose**: Manages user registration and login.
- **Key Components**:
  - **Database Connection**: Connects to MongoDB to store user data.
  - **JWT Authentication**: Uses JSON Web Tokens for secure authentication.
  - **Routes**: Provides endpoints for user registration and login.
- **Code References**:
  - Server setup and routes: `auth-service/server.js` (startLine: 1, endLine: 25)
  - User model: `auth-service/models/User.js` (startLine: 1, endLine: 28)
  - Authentication middleware: `auth-service/middleware/authMiddleware.js` (startLine: 1, endLine: 18)

### Train Service

- **Purpose**: Manages train data, including train details and seat availability.
- **Key Components**:
  - **Database Connection**: Connects to MongoDB to store train data.
  - **Redis Caching**: Uses Redis to cache train and seat data for quick access.
  - **RabbitMQ**: Consumes messages for seat status updates.
- **Code References**:
  - Server setup and routes: `train-service/server.js` (startLine: 1, endLine: 26)
  - Train model: `train-service/models/Train.js` (startLine: 1, endLine: 16)
  - Seat status update logic: `train-service/services/trainService.js` (startLine: 88, endLine: 125)

### Booking Service

- **Purpose**: Handles booking operations, including seat reservation and booking status updates.
- **Key Components**:
  - **Database Connection**: Connects to MongoDB to store booking data.
  - **Redis Caching**: Uses Redis to manage seat availability.
  - **RabbitMQ**: Sends and receives messages for booking and payment processing.
- **Code References**:
  - Server setup and routes: `booking-service/server.js` (startLine: 1, endLine: 26)
  - Booking model: `booking-service/models/Booking.js` (startLine: 1, endLine: 13)
  - Booking service logic: `booking-service/services/bookingService.js` (startLine: 35, endLine: 180)

### Payment Service

- **Purpose**: Processes payments and sends notifications for booking confirmations.
- **Key Components**:
  - **Database Connection**: Connects to MongoDB to store payment data.
  - **RabbitMQ**: Consumes messages for payment processing and sends notifications.
  - **Email Notifications**: Uses Nodemailer to send booking confirmation emails.
- **Code References**:
  - Server setup: `payment-service/server.js` (startLine: 1, endLine: 26)
  - Payment model: `payment-service/models/Payment.js` (startLine: 1, endLine: 12)
  - Payment processing logic: `payment-service/services/paymentService.js` (startLine: 19, endLine: 64)

### API Gateway

- **Purpose**: Acts as a single entry point for client requests, routing them to the appropriate services.
- **Key Components**:
  - **Express Server**: Sets up the server and routes requests to different services.
  - **Prometheus Metrics**: Collects and exposes metrics for monitoring.
  - **CORS**: Enables Cross-Origin Resource Sharing for client requests.
- **Code References**:
  - Server setup and middleware: `api-gateway/server.js` (startLine: 1, endLine: 93)
  - Authentication middleware: `api-gateway/middleware/authMiddleware.js` (startLine: 1, endLine: 17)

## Tools Used for this project

![alt text](./images/Evolvifiers.drawio%20(1).svg)

## Infrastructure

- **Docker**: Each service has a Dockerfile for containerization.
- **Docker Compose**: A `docker-compose.yml` file is used to orchestrate the services.
- **Kubernetes**: Deployment manifests are provided for deploying the services on a Kubernetes cluster.
- **Terraform**: Infrastructure as code is managed using Terraform for AWS resources.

## Monitoring and CI/CD

![alt text](./images/WhatsApp%20Image%202024-10-25%20at%209.10.15%20AM.jpeg)

- **Prometheus**: Used for monitoring API Gateway metrics.
- **GitHub Actions**: CI/CD pipelines are set up for each service to automate testing and deployment.

## Conclusion

This codebase is a comprehensive microservices architecture for a train booking system, utilizing modern technologies like Docker, Kubernetes, and RabbitMQ to ensure scalability, reliability, and efficient communication between services. Each service is designed to handle specific tasks, and the API Gateway provides a unified interface
=======
## Overview

This guide outlines the workflow and key components for implementing the frontend of the train booking system. The frontend will interact with the API gateway to provide user authentication, train data display, and booking functionalities.

## Workflow

1. User Authentication
2. Train Listing and Filtering
3. Individual Train Details and Seat Status
4. Booking Process

## API Gateway

The API gateway service is the central point for frontend communication. It's defined in:



## Implementation Steps

### 1. User Authentication

#### Login and Registration Page
- Create a login form with email and password fields
- Create a registration form with name, email, password, and contact number fields
- Implement form validation
- Send POST requests to the following endpoints:
  - Login: `/api/auth/login`
  - Register: `/api/auth/register`
- Store the returned JWT token for authenticated requests

### 2. Train Listing and Filtering

#### Train List Page
- Fetch train data from `/api/trains` (GET request)
- Display trains in a list or grid format
- Implement filtering options:
  - Date of travel
  - Source station
  - Destination station
- Add pagination or infinite scrolling for large datasets

### 3. Individual Train Details and Seat Status

#### Train Details Page
- Fetch specific train data from `/api/trains/:trainId` (GET request)
- Display train details:
  - Train number
  - Name
  - Source and destination
  - Departure and arrival times
- Show seat availability status
- Implement a seat map or visual representation of available seats

### 4. Booking Process

#### Booking Form
- Create a booking form with:
  - Passenger details (name, age, gender)
  - Seat selection
- Implement seat selection functionality
- Send booking request to `/api/bookings` (POST request)
- Handle booking confirmation and display booking details

#### Payment Integration
- Integrate with the payment service via `/api/payments`
- Implement a secure payment form
- Handle payment confirmation and update booking status

## Additional Considerations

### State Management
- Use a state management solution (e.g., Redux, MobX, or React Context) for managing application-wide state

### Error Handling
- Implement proper error handling for API requests
- Display user-friendly error messages

### Loading States
- Add loading indicators for asynchronous operations

### Responsive Design
- Ensure the application is responsive and works well on various device sizes

### Accessibility
- Implement proper accessibility features (ARIA attributes, keyboard navigation)

### Testing
- Write unit tests for components and integration tests for key workflows

## Security Considerations

- Implement secure storage for JWT tokens (e.g., HttpOnly cookies)
- Use HTTPS for all API communications
- Implement CSRF protection
- Sanitize user inputs to prevent XSS attacks

## Performance Optimization

- Implement code splitting for better load times
- Use lazy loading for images and components
- Optimize API requests with proper caching strategies

By following this guide, you can create a comprehensive frontend for the train booking system that integrates seamlessly with the provided API gateway and microservices architecture.
>>>>>>> 94653d3df9ac7a9948db04d9f548b7bad688e8c2
