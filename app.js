require("dotenv").config({ path: "./server/.env" });
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

// MongoDB oturum deposu oluşturun
const store = new MongoDBStore({
  uri: "mongodb+srv://kokceoguz:Okokce57**@cluster0.0scazco.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  collection: "sessions",
});

// Hata olaylarını dinleyin
store.on("error", function (error) {
  console.log(error);
});

// MongoDB bağlantısı
mongoose
  .connect(
    "mongodb+srv://kokceoguz:Okokce57**@cluster0.0scazco.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // MongoDB sunucusunun yanıt vermesi için 5 saniye bekler
    }
  )
  .then(() => {
    console.log("MongoDB bağlantısı başarılı");
  })
  .catch((error) => {
    console.error("MongoDB bağlantı hatası:", error);
  });

// Middleware
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser("CookingBlogSecure"));
app.use(
  session({
    secret: "CookingBlogSecretSession",
    saveUninitialized: true,
    resave: false,
    store: store,
  })
);
app.use(flash());
app.use(fileUpload());

app.set("view engine", "ejs");
app.set("layout", "layouts/main");

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.error_msg = req.flash("error_msg");
  res.locals.success_msg = req.flash("success_msg");
  res.locals.info_msg = req.flash("info_msg");
  next();
});

// Route Files
const routes = require("./server/routes/recipeRoutes.js");
const userRoutes = require("./server/routes/userRoutes.js");
const commentRoutes = require("./server/routes/commentRoutes.js");
const newsRoutes = require("./server/routes/newsRoutes.js"); // Haber rotalarını ekleyin

app.use("/", routes);
app.use("/users", userRoutes);
app.use("/comments", commentRoutes);
app.use("/news", newsRoutes); // Haber rotalarını kullanıma alın

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Başlatıldı");
});
