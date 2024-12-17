const express = require("express");
const routes = require("./routes");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const db = require("./config/db");
const cors = require("cors");

const app = express();
const port = 8081;

// Middleware để xử lý body và cookie
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser("helloword"));

app.use(cors({
  origin: "http://localhost:3000", // URL của Next.js frontend
  credentials: true, // Để gửi cookie hoặc thông tin xác thực
}));

// Middleware quản lý session
app.use(
  session({
    secret: "helloword",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60, // 1 giờ
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
routes(app);

// Kết nối database
db.dbConnect();

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
