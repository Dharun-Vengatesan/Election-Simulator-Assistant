/**
 * Server Setup
 * Initializes Express, applies security headers, compression, rate-limiting, and routes.
 */
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();

// 1. Security Middleware
app.use(helmet()); // Sets robust HTTP headers
app.use(cors());   // Allows cross-origin requests

// 2. Efficiency Middleware
app.use(compression()); // Gzip compression

// 3. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// 4. Static Files with Caching
app.use(express.static(path.join(__dirname, '../public'), {
  maxAge: '1d' // 1 day cache
}));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

// Export app for testing purposes
module.exports = app;

// Only start the server if this script is executed directly
if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
