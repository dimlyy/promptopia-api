const passport = require("../strategies/local-strategy");
const userRouter = require("./user.router");

function routes(app) {
    app.use("/", userRouter);
}

module.exports = routes;
