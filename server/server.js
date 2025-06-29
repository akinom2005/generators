// Required Modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3000;

// ✅ Connect to MongoDB
mongoose.connect('mongodb+srv://monikarajalingam:m1o2n3i4@powertech.kmn42fm.mongodb.net/powertech?retryWrites=true&w=majority')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Define Booking Schema
const bookingSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  email: String,
  bookingType: String,
  kva: String,
  duration: String,
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Booking = mongoose.model('Booking', bookingSchema);

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Handle Booking POST Request
app.post('/booking', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    console.log('📥 Booking saved:', booking);
    res.send('<script>alert("Booking saved successfully!"); window.history.back();</script>');
  } catch (error) {
    console.error('❌ Error saving booking:', error);
    res.status(500).send(`Something went wrong: ${error.message}`);
  }
});


// ✅ Admin Route: View All Bookings
app.get('/admin', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    let html = `
      <h2>All Generator Bookings</h2>
      <table border="1" cellpadding="10" style="border-collapse: collapse;">
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Type</th>
          <th>KVA</th>
          <th>Duration</th>
          <th>Message</th>
          <th>Date</th>
        </tr>
    `;

    bookings.forEach(b => {
      html += `
        <tr>
          <td>${b.fullName}</td>
          <td>${b.phone}</td>
          <td>${b.email}</td>
          <td>${b.bookingType}</td>
          <td>${b.kva}</td>
          <td>${b.duration}</td>
          <td>${b.message}</td>
          <td>${new Date(b.createdAt).toLocaleString()}</td>
        </tr>
      `;
    });

    html += `</table>`;
    res.send(html);
  } catch (err) {
    console.error('❌ Error fetching bookings:', err);
    res.status(500).send('Error loading bookings');
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
