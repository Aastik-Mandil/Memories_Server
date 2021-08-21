const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require('dotenv');


const app = express();
dotenv.config();

// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// routers
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");

// use of routers
app.use("/posts", postRoutes);
app.use("/user", userRoutes);

// database connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,
}, () => {
    console.log("Database connect");
});


// server running
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});