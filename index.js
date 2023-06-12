const express = require('express');
require('dotenv').config()
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken'); // Add JWT library
const config = require('./config'); // Create a separate config file
const currentDate = new Date();
const timestamp = currentDate.toISOString().slice(0, 10);

// Parse JSON request bodies
app.use(bodyParser.json());

// Middleware to verify authorization token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ error: 'Authorization token not found' });
    return;
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, config.jwtSecret);
    req.userId = decoded.userId; // Add the decoded user ID to the request object
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid authorization token' });
  }
};

// Membuat koneksi ke database MySQL
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  port: process.env.MYSQL_PORT,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
  // host: 'containers-us-west-172.railway.app',
  // user: 'root',
  // port: 6824,
  // password: 'vL9RhgWmWflNVCpVJy29',
  // database: 'railway'
});



app.get('/', (req, res) => {
  res.json({ message: 'Success',timestamp:timestamp });
})
// Endpoint untuk mendapatkan semua pengguna
app.get('/users', verifyToken, (req, res) => {
  // Query SQL untuk mengambil semua data pengguna dari tabel "users"
  const query = 'SELECT * FROM users';

  // Melakukan eksekusi query ke database dan mengirim respons dengan data pengguna
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// Endpoint untuk mendapatkan detail pengguna berdasarkan ID
app.get('/users/:id',verifyToken, (req, res) => {
  const userId = req.params.id;

  // Query SQL untuk mengambil data pengguna berdasarkan ID dari tabel "users"
  const query = `SELECT * FROM users WHERE id = ${userId}`;

  // Melakukan eksekusi query ke database dan mengirim respons dengan data pengguna
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(results[0]);
  });
});

// Endpoint untuk membuat pengguna baru
app.post('/users', (req, res) => {
  const { name, email, password, address, phone_number } = req.body;

  // Query SQL untuk memasukkan data pengguna baru ke dalam tabel "users"
  const query = `INSERT INTO users (name, email, password, address, phone_number) VALUES ('${name}', '${email}', '${password}','${address}','${phone_number}')`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'User created successfully' });
  });
});

// Endpoint untuk mengupdate pengguna berdasarkan ID
app.put('/users/:id',verifyToken, (req, res) => {
  const userId = req.params.id;
  const { name, email, password, address, phone_number } = req.body;

  // Query SQL untuk mengupdate data pengguna berdasarkan ID di tabel "users"
  const query = `UPDATE users SET name = '${name}', email = '${email}', password = '${password}', address = '${address}', phone_number = '${phone_number}' WHERE id = ${userId}`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'User updated successfully' });
  });
});

// Endpoint untuk menghapus pengguna berdasarkan ID
app.delete('/users/:id',verifyToken, (req, res) => {
  const userId = req.params.id;

  // Query SQL untuk menghapus data pengguna berdasarkan ID dari tabel "users"
  const query = `DELETE FROM users WHERE id = ${userId}`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'User deleted successfully' });
  });
});

// Login API - Generates Authentication Token
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Query SQL to check if the user exists with the provided email and password
  const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;

  // Execute the query to check user credentials
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // User is authenticated, generate a JWT token
    const user = results[0];
    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' });

    // Return the generated token
    res.json({ token });
  });
});

//countries
app.get('/countries',verifyToken, (req, res) => {
  // Query SQL untuk mengambil semua data negara dari tabel "countries"
  const query = 'SELECT * FROM countries';

  // Melakukan eksekusi query ke database dan mengirim respons dengan data negara
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching countries:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// Endpoint untuk mendapatkan detail negara berdasarkan ID
app.get('/countries/:id',verifyToken, (req, res) => {
  const countryId = req.params.id;

  // Query SQL untuk mengambil data negara berdasarkan ID dari tabel "countries"
  const query = `SELECT * FROM countries WHERE id = ${countryId}`;

  // Melakukan eksekusi query ke database dan mengirim respons dengan data negara
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching country:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Country not found' });
      return;
    }
    res.json(results[0]);
  });
});

app.post('/countries',verifyToken, (req, res) => {
  const { name, capital } = req.body;

  // Query SQL untuk memasukkan data negara baru ke dalam tabel "countries"
  const query = `INSERT INTO countries (name, capital) VALUES ('${name}', '${capital})`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error creating country:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Country created successfully' });
  });
});

// Endpoint untuk mengupdate negara berdasarkan ID
app.put('/countries/:id',verifyToken, (req, res) => {
  const countryId = req.params.id;
  const { name, capital } = req.body;

  // Query SQL untuk mengupdate data negara berdasarkan ID di tabel "countries"
  const query = `UPDATE countries SET name = '${name}', capital = '${capital}' WHERE id = ${countryId}`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error updating country:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Country updated successfully' });
  });
});

// Endpoint untuk menghapus negara berdasarkan ID
app.delete('/countries/:id',verifyToken, (req, res) => {
  const countryId = req.params.id;

  // Query SQL untuk menghapus data negara berdasarkan ID dari tabel "countries"
  const query = `DELETE FROM countries WHERE id = ${countryId}`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error deleting country:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Country deleted successfully' });
  });
});

//DESTINATIONS
app.get('/destinations',verifyToken, (req, res) => {
  // Query SQL untuk mengambil semua data tujuan wisata dari tabel "destinations"
  const query = 'SELECT * FROM destinations';

  // Melakukan eksekusi query ke database dan mengirim respons dengan data tujuan wisata
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching destinations:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// Endpoint untuk mendapatkan detail tujuan wisata berdasarkan ID
app.get('/destinations/:id',verifyToken, (req, res) => {
  const destinationId = req.params.id;

  // Query SQL untuk mengambil data tujuan wisata berdasarkan ID dari tabel "destinations"
  const query = `SELECT * FROM destinations WHERE id = ${destinationId}`;

  // Melakukan eksekusi query ke database dan mengirim respons dengan data tujuan wisata
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching destination:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'destination not found' });
      return;
    }
    res.json(results[0]);
  });
});

// Endpoint untuk membuat tujuan wisata baru
app.post('/destinations',verifyToken, (req, res) => {
  const { name, description, location, image_url, country_id } = req.body;

  // Query SQL untuk memasukkan data tujuan wisata baru ke dalam tabel "destinations"
  const query = `INSERT INTO destinations (name, description, location, image_url, country_id) VALUES ('${name}', '${description}', '${location}', '${image_url}', ${country_id})`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error creating destination:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'destination created successfully' });
  });
});

// Endpoint untuk mengupdate tujuan wisata berdasarkan ID
app.put('/destinations/:id',verifyToken, (req, res) => {
  const destinationId = req.params.id;
  const { name, description, location, image_url, country_id } = req.body;

  // Query SQL untuk mengupdate data tujuan wisata berdasarkan ID di tabel "destinations"
  const query = `UPDATE destinations SET name = '${name}', description = '${description}', location = '${location}', image_url = '${image_url}', country_id = ${country_id} WHERE id = ${destinationId}`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error updating destination:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'destination updated successfully' });
  });
});

// Endpoint untuk menghapus tujuan wisata berdasarkan ID
app.delete('/destinations/:id',verifyToken, (req, res) => {
  const destinationId = req.params.id;

  // Query SQL untuk menghapus data tujuan wisata berdasarkan ID dari tabel "destinations"
  const query = `DELETE FROM destinations WHERE id = ${destinationId}`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error deleting destination:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'destination deleted successfully' });
  });
});

//TICKETS
app.get('/tickets',verifyToken, (req, res) => {
  // Query SQL untuk mengambil semua data tiket dari tabel "tickets"
  const query = 'SELECT * FROM tickets';

  // Melakukan eksekusi query ke database dan mengirim respons dengan data tiket
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching tickets:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// Endpoint untuk mendapatkan detail tiket berdasarkan ID
app.get('/tickets/:id',verifyToken, (req, res) => {
  const ticketId = req.params.id;

  // Query SQL untuk mengambil data tiket berdasarkan ID dari tabel "tickets"
  const query = `SELECT * FROM tickets WHERE id = ${ticketId}`;

  // Melakukan eksekusi query ke database dan mengirim respons dengan data tiket
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching ticket:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Ticket not found' });
      return;
    }
    res.json(results[0]);
  });
});

// Endpoint untuk membuat tiket baru
app.post('/tickets',verifyToken, (req, res) => {
  const { destination_id, ticket_type, price, available_quantity, start_date, end_date } = req.body;
  const query = `INSERT INTO tickets (destination_id, ticket_type, price, available_quantity, start_date, end_date) VALUES (${destination_id}, '${ticket_type}', ${price}, ${available_quantity}, '${start_date}', '${end_date}')`;


  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error creating ticket:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Ticket created successfully' });
  });
});

// Endpoint untuk mengupdate tiket berdasarkan ID
app.put('/tickets/:id',verifyToken, (req, res) => {
  const ticketId = req.params.id;
  const { destination_id, ticket_type, price, available_quantity, start_date, end_date } = req.body;
  const query = `UPDATE tickets SET destination_id = ${destination_id}, ticket_type = '${ticket_type}', price = ${price}, available_quantity = ${available_quantity}, start_date = '${start_date}', end_date = '${end_date}' WHERE id = ${ticketId}`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error updating ticket:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Ticket updated successfully' });
  });
});

// Endpoint untuk menghapus tiket berdasarkan ID
app.delete('/tickets/:id',verifyToken, (req, res) => {
  const ticketId = req.params.id;

  // Query SQL untuk menghapus data tiket berdasarkan ID dari tabel "tickets"
  const query = `DELETE FROM tickets WHERE id = ${ticketId}`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error deleting ticket:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Ticket deleted successfully' });
  });
});


//PAYMENTS
app.get('/payments',verifyToken, (req, res) => {
  // Query SQL untuk mengambil semua data pembayaran dari tabel "payments"
  const query = 'SELECT * FROM payments';

  // Melakukan eksekusi query ke database dan mengirim respons dengan data pembayaran
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// Endpoint untuk mendapatkan detail pembayaran berdasarkan ID
app.get('/payments/:id',verifyToken, (req, res) => {
  const paymentId = req.params.id;

  // Query SQL untuk mengambil data pembayaran berdasarkan ID dari tabel "payments"
  const query = `SELECT * FROM payments WHERE id = ${paymentId}`;

  // Melakukan eksekusi query ke database dan mengirim respons dengan data pembayaran
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Payment not found' });
      return;
    }
    res.json(results[0]);
  });
});

// Endpoint untuk membuat pembayaran baru
app.post('/payments',verifyToken, (req, res) => {
  const { booking_id, payment_method, amount, payment_date } = req.body;

  // Query SQL untuk memasukkan data pembayaran baru ke dalam tabel "payments"
  const query = `INSERT INTO payments (booking_id, payment_method, amount, payment_date) VALUES (${booking_id}, '${payment_method}', ${amount}, '${payment_date}')`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error creating payment:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Payment created successfully' });
  });
});

// Endpoint untuk mengupdate pembayaran berdasarkan ID
app.put('/payments/:id',verifyToken, (req, res) => {
  const paymentId = req.params.id;
  const { booking_id, payment_method, amount, payment_date } = req.body;

  // Query SQL untuk mengupdate data pembayaran berdasarkan ID di tabel "payments"
  const query = `UPDATE payments SET booking_id = ${booking_id}, payment_method = '${payment_method}', amount = ${amount}, payment_date = '${payment_date}' WHERE id = ${paymentId}`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error updating payment:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Payment updated successfully' });
  });
});

// Endpoint untuk menghapus pembayaran berdasarkan ID
app.delete('/payments/:id',verifyToken, (req, res) => {
  const paymentId = req.params.id;

  // Query SQL untuk menghapus data pembayaran berdasarkan ID dari tabel "payments"
  const query = `DELETE FROM payments WHERE id = ${paymentId}`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error deleting payment:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Payment deleted successfully' });
  });
});


//BOOKING
app.get('/bookings',verifyToken, (req, res) => {
  // Query SQL untuk mengambil semua data booking dari tabel "bookings"
  const query = 'SELECT * FROM bookings';

  // Melakukan eksekusi query ke database dan mengirim respons dengan data booking
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// Endpoint untuk mendapatkan detail booking berdasarkan ID
app.get('/bookings/:id',verifyToken, (req, res) => {
  const bookingId = req.params.id;

  // Query SQL untuk mengambil data booking berdasarkan ID dari tabel "bookings"
  const query = `SELECT * FROM bookings WHERE id = ${bookingId}`;

  // Melakukan eksekusi query ke database dan mengirim respons dengan data booking
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    res.json(results[0]);
  });
});

// Endpoint untuk membuat booking baru
app.post('/bookings',verifyToken, (req, res) => {
  const { user_id, ticket_id, quantity, total_price, booking_date } = req.body;

  // Query SQL untuk memasukkan data booking baru ke dalam tabel "bookings"
  const query = `INSERT INTO bookings (user_id, ticket_id, quantity, total_price, booking_date) VALUES (${user_id}, ${ticket_id}, ${quantity}, ${total_price}, '${booking_date}')`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Booking created successfully' });
  });
});

// Endpoint untuk mengupdate booking berdasarkan ID
app.put('/bookings/:id',verifyToken, (req, res) => {
  const bookingId = req.params.id;
  const { user_id, ticket_id, quantity, total_price, booking_date } = req.body;

  // Query SQL untuk mengupdate data booking berdasarkan ID di tabel "bookings"
  const query = `UPDATE bookings SET user_id = ${user_id}, ticket_id = ${ticket_id}, quantity = ${quantity}, total_price = ${total_price}, booking_date = '${booking_date}' WHERE id = ${bookingId}`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Booking updated successfully' });
  });
});

// Endpoint untuk menghapus booking berdasarkan ID
app.delete('/bookings/:id',verifyToken,(req, res) => {
  const bookingId = req.params.id;

  // Query SQL untuk menghapus data booking berdasarkan ID dari tabel "bookings"
  const query = `DELETE FROM bookings WHERE id = ${bookingId}`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Booking deleted successfully' });
  });
});


//REVIEWS

app.get('/reviews',verifyToken, (req, res) => {
  // Query SQL untuk mengambil semua data ulasan dari tabel "reviews"
  const query = 'SELECT * FROM reviews';

  // Melakukan eksekusi query ke database dan mengirim respons dengan data ulasan
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

// Endpoint untuk mendapatkan detail ulasan berdasarkan ID
app.get('/reviews/:id',verifyToken, (req, res) => {
  const reviewId = req.params.id;

  // Query SQL untuk mengambil data ulasan berdasarkan ID dari tabel "reviews"
  const query = `SELECT * FROM reviews WHERE id = ${reviewId}`;

  // Melakukan eksekusi query ke database dan mengirim respons dengan data ulasan
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching review:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }
    res.json(results[0]);
  });
});

// Endpoint untuk membuat ulasan baru
app.post('/reviews',verifyToken, (req, res) => {
  const { user_id, destination_id, rating, comment,review_date } = req.body;

  // Query SQL untuk memasukkan data ulasan baru ke dalam tabel "reviews"
  const query = `INSERT INTO reviews (user_id, destination_id, rating, comment, review_date) VALUES (${user_id}, ${destination_id}, ${rating}, '${comment}', '${review_date}')`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error creating review:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Review created successfully' });
  });
});

// Endpoint untuk mengupdate ulasan berdasarkan ID
app.put('/reviews/:id',verifyToken, (req, res) => {
  const reviewId = req.params.id;
  const { user_id, destination_id, rating, comment, review_date } = req.body;

  // Query SQL untuk mengupdate data ulasan berdasarkan ID di tabel "reviews"
  const query = `UPDATE reviews SET user_id = ${user_id}, destination_id = ${destination_id}, rating = ${rating}, comment = '${comment}', review_date ='${review_date}' WHERE id = ${reviewId}`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Review updated successfully' });
  });
});

// Endpoint untuk menghapus ulasan berdasarkan ID
app.delete('/reviews/:id',verifyToken, (req, res) => {
  const reviewId = req.params.id;

  // Query SQL untuk menghapus data ulasan berdasarkan ID dari tabel "reviews"
  const query = `DELETE FROM reviews WHERE id = ${reviewId}`;

  // Melakukan eksekusi query ke database dan mengirim respons
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json({ message: 'Review deleted successfully' });
  });
});




// Memulai server pada port tertentu
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
