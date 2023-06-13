# Express API

This is a simple Express API for tourism booking ticket. It provides various endpoints to perform CRUD (Create, Read, Update, Delete) operations on these entities.

![Beautiful Places in Indonesia](https://media.istockphoto.com/id/675172642/photo/pura-ulun-danu-bratan-temple-in-bali.webp?b=1&s=170667a&w=0&k=20&c=i6eVZIrC53B4jl-I4p3YIn9ZRViyVoMbRdp-NznLDUE=)


## Setup

1. Clone the repository: `git clone <repository_url>`
2. Install the dependencies: `npm install`
3. Create a `.env` file in the root directory and configure the following environment variables:
   - `MYSQL_HOST` - MySQL host
   - `MYSQL_USER` - MySQL username
   - `MYSQL_PORT` - MySQL port
   - `MYSQL_PASSWORD` - MySQL password
   - `MYSQL_DATABASE` - MySQL database name
   - `JWT_SECRET` - Secret key for JWT token generation
   - -`PORT` - PORT to run the server
4. Start the server: `npm start`

## Endpoints

### Users

- `GET /users`: Get all users (Requires authentication)
- `GET /users/:id`: Get user by ID (Requires authentication)
- `POST /users`: Create a new user
- `PUT /users/:id`: Update user by ID (Requires authentication)
- `DELETE /users/:id`: Delete user by ID (Requires authentication)
- `POST /login`: Authenticate user and generate JWT token

### Countries

- `GET /countries`: Get all countries (Requires authentication)
- `GET /countries/:id`: Get country by ID (Requires authentication)
- `POST /countries`: Create a new country (Requires authentication)
- `PUT /countries/:id`: Update country by ID (Requires authentication)
- `DELETE /countries/:id`: Delete country by ID (Requires authentication)

### Destinations

- `GET /destinations`: Get all destinations (Requires authentication)
- `GET /destinations/:id`: Get destination by ID (Requires authentication)
- `POST /destinations`: Create a new destination (Requires authentication)
- `PUT /destinations/:id`: Update destination by ID (Requires authentication)
- `DELETE /destinations/:id`: Delete destination by ID (Requires authentication)

### Tickets

- `GET /tickets`: Get all tickets (Requires authentication)
- `GET /tickets/:id`: Get ticket by ID (Requires authentication)
- `POST /tickets`: Create a new ticket (Requires authentication)
- `PUT /tickets/:id`: Update ticket by ID (Requires authentication)
- `DELETE /tickets/:id`: Delete ticket by ID (Requires authentication)

### Bookings

- `GET /bookings`: Get all bookings (Requires authentication)
- `GET /bookings/:id`: Get booking by ID (Requires authentication)
- `POST /bookings`: Create a new booking (Requires authentication)
- `PUT /bookings/:id`: Update booking by ID (Requires authentication)
- `DELETE /bookings/:id`: Delete booking by ID (Requires authentication)

### Payments

- `GET /payments`: Get all payments (Requires authentication)
- `GET /payments/:id`: Get payment by ID (Requires authentication)
- `POST /payments`: Create a new payment (Requires authentication)
- `PUT /payments/:id`: Update payment by ID (Requires authentication)
- `DELETE /payments/:id`: Delete payment by ID (Requires authentication)

### Reviews

- `GET /reviews`: Get all reviews (Requires authentication)
- `GET /reviews/:id`: Get review by ID (Requires authentication)
- `POST /reviews`: Create a new review (Requires authentication)
- `PUT /reviews/:id`: Update review by ID (Requires authentication)
- `DELETE /reviews/:id`: Delete review by ID (Requires authentication)

### Booking Bundle

- `GET /booking_bundle`: Get all booking bundles 
- `GET /booking_bundle/:id`: Get booking bundle by ID 
- `POST /booking_bundle`: Create a new booking bundle 
- `PUT /booking_bundle/:id`: Update booking bundle by ID 
- `DELETE /booking_bundle/:id`: Delete booking bundle by ID 


## Authentication

Authentication is required for certain endpoints. To authenticate, include a valid JWT token in the `Authorization` header of the request.

Example:

```
Authorization: <token>
```

## Error Responses

In case of any errors, the API will respond with an appropriate HTTP status code and an error message in JSON format.

Example:

```json
{
  "error": "Authorization token not found"
}
```

```json
{
  "error": "Invalid authorization token"
}
```

```json
{
  "error": "User not found"
}
```

## Timestamp

The API responds with the current timestamp in the format `YYYY-MM-DD` for the root endpoint (`/`).

Example:

```json
{
  "message": "Success",
  "timestamp": "2023-06-13"
}
```
