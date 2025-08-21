// backend/routes/testRoutes.js
const express = require('express');
const router = express.Router();

// Example test route: check server is running
router.get('/ping', (req, res) => {
  res.json({ message: "Pong! Server is working." });
});

// Another example route
router.get('/hello', (req, res) => {
  res.send("Hello from testRoutes!");
});

module.exports = router;
