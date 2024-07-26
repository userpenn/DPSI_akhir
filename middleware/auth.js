const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library
require("dotenv").config(); // Load environment variables from a .env file

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "Access Denied" }); // Return 401 if no token is provided
  }

  try {
    // Verify the token using the secret key from environment variables
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified; // Attach the verified token payload to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" }); // Return 400 if the token is invalid
  }
};

// Middleware to authorize based on user roles
const authorizeRole = (roles) => {
  return (req, res, next) => {
    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied" }); // Return 403 if the user is not authorized
    }
    next(); // Proceed to the next middleware or route handler
  };
};

module.exports = { authenticateToken, authorizeRole }; // Export the middleware functions
