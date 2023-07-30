// backend/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
dotenv.config();

const authRouter = require("./routes/auth");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);

const uri = process.env.MONGODB_URI;
mongoose
  .connect(uri, {
    dbName: "Agumentik",
  })
  .then(() => console.log("Database is connected"))
  .catch((e) => console.log(e));

const port = process.env.PORT || 8000;
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
