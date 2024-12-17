const bcrypt = require("bcrypt");
const { dbConnect } = require("../../config/db");

const { query } = dbConnect();

class UserController {
  userLogin(req, res) {
    // Khi xác thực thành công
    res.status(200).json({
      message: "Authentication successful",
      user: req.user,
    });
  }

  userStatus(req, res) {
    console.log(req.user);
    if (req.user) {
      return res.status(200).json(req.user);
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }

  userLogout(req, res) {
    if (!req.user) {
      return res.status(401).json({ message: "No user found" });
    } else {
      req.logout((err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging out" });
        }

        return res.status(200).json({ message: "Logged out successfully" });
      });
    }
  }

  async userSignUp(req, res, next) {
    try {
      const { email, password } = req.body;

      const salt = await bcrypt.genSalt(10);

      // Hash mật khẩu
      const hashedPassword = await bcrypt.hash(password, salt);

      // Chèn người dùng vào cơ sở dữ liệu
      const result = await query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword]
      );

      // Lấy ID của người dùng vừa chèn
      const userID = result.insertId;

      // Tạo đối tượng người dùng
      const user = {
        id: userID,
        email: email,
      };

      // Đăng nhập người dùng và lưu vào session
      req.login(user, function (err) {
        if (err) {
          return next(err);
        } else {
          return res.status(201).json({
            message: "User registered successfully",
            user: user,
          });
        }
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error registering user", error: err.message });
    }
  }
}

module.exports = new UserController();
