const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config()
// Import route handlers
const {
  submitHandler,
  loginHandler,
  verifyUser,
  getAppliedHandler,
  getDataHandler,
  homeHandler,
  getProfileHandler,
  logoutHandler,
  applyHandler
} = require('./Routes/handlers');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Update based on your frontend URL
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('Error connecting to MongoDB:', err));

app.use(express.static(path.join(__dirname, 'build')));

app.post('/submit', submitHandler);
app.post('/login', loginHandler);
app.post('/logout', logoutHandler);
app.get('/data', getDataHandler);
app.get('/profile', verifyUser, getProfileHandler);
app.get('/home', verifyUser, homeHandler);
app.post('/apply', verifyUser, applyHandler);
app.get('/applied', verifyUser, getAppliedHandler);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
