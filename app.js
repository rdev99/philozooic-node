const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { connect } = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const envData = process.env;

const doctorRoutes = require("./routes/DoctorRoute");
const caretakerRoutes = require("./routes/CaretakerRoute");
const userRoutes = require("./routes/UserRoute");
const petRoutes = require("./routes/PetRoute");
const ngoRoutes = require("./routes/NgoRoute");
const reviewRoutes = require("./routes/ReviewRoute");
const quoteReviews = require("./routes/QuoteRoute");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/doctor", doctorRoutes);
app.use("/caretaker", caretakerRoutes);
app.use("/pet", petRoutes);
app.use("/ngo", ngoRoutes);
app.use("/review", reviewRoutes);
app.use("/quote", quoteReviews);
app.use(userRoutes);

connect(envData.DB, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.info("MongoDB connected successfully");
  })
  .catch(() => {
    console.error("Error connecting to the database.");
  });

var project = "Philozooic Backend";
const PORT = 8000;
app.listen(PORT, () => {
  console.info(`${project} is running on ${PORT}`);
});
