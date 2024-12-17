const passport = require("passport");
const { Strategy } = require("passport-local");
const { dbConnect } = require("../config/db");
const bcrypt = require("bcrypt");

const { query } = dbConnect();

passport.use(
    new Strategy(
        { usernameField: "email" }, // Cấu hình để dùng 'email' thay vì 'username'
        async (email, password, done) => {
            console.log("email: " + email);
            console.log("password: " + password);
            try {
                // Truy vấn database sử dụng cột email để xác thực
                const rows = await query("SELECT * FROM users WHERE email = ?", [email]);

                // Nếu không tìm thấy user
                if (rows.length === 0) {
                    return done(null, false, { message: "User not found" });
                }

                const user = rows[0];

                // Kiểm tra mật khẩu
                const isMatch = await bcrypt.compare(password, user.password); // So sánh mật khẩu

                if (!isMatch) {
                  return done(null, false, { message: "Password incorrect" });
                }

                // Trả về user nếu thông tin hợp lệ
                return done(null, user);
            } catch (e) {
                console.error("Database query error:", e);
                return done(e, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);  // Lưu trữ thông tin cần thiết, ví dụ: user.id vào session
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await query("SELECT * FROM users WHERE id = ?", [id]);
        if (user.length > 0) {
            done(null, user[0]);
        } else {
            done(new Error("User not found"));
        }
    } catch (error) {
        done(error, null);
    }
});


module.exports = passport;
