require("dotenv").config({ path: "./server/.env" });

const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;
console.log("MongoDB URI:", uri); // Test için eklendi

if (!uri) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", (error) => {
  console.error("connection error:", error);
  process.exit(1); // Bağlantı hatası durumunda uygulamayı sonlandır
});
db.once("open", function () {
  console.log("Connected to MongoDB");
});

// Models
require("./models/Category");
require("./models/Recipe");
require("./models/User"); // User modelini ekleyin
