const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const logger = require("morgan");
// Import database
const sequelize = require("./config/database");
// Import Router yang telah dibuat
const authRouter = require("./routes/auth");
const complaintsRouter = require("./routes/complaints");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use("/auth", authRouter);
app.use("/complaints", complaintsRouter);

// Sync the database
sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });

app.get("/", (req, res) => {
  res.send("API pengaduan mahasiswa oleh: Alfin Nur Muflihin");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).json({ message: "Not Found" });
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({ message: err.message });
});

module.exports = app;
