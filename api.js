const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const planRouter = require("./routes/planRoutes");
// to  add post body data to req.body
app.use(express.json());
// add cookies to req.cookies
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/user", userRouter);

app.use("/api/v1/plan", planRouter);
// /api/v1/user is represented by userRouter and userRouter also gets app features like .get, .post, .put, .delete

// We can do /login after /api/v1/auth and it will be handled by authRouter

// update user Profile
// delete user profile

// Static function/route

app.use(function (req, res) {
  res.send("<h1>Backend API</h1>");
});

// localhost:3000 -> express API
const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log(`server started at port ${port}`);
});
