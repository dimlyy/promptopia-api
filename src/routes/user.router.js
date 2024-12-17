const express = require("express");
const router = express.Router();
const passport = require("../strategies/local-strategy");

const userController = require("../app/controllers/UserController");

router.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Node.js server!' });
});


router.post(
  "/api/auth/login",
  passport.authenticate("local", { failureFlash: false, failureMessage: true }),
  userController.userLogin
);

router.get("/api/auth/status", userController.userStatus);
router.post("/api/auth/logout", userController.userLogout);
router.post("/api/auth/signup", userController.userSignUp);

module.exports = router;
