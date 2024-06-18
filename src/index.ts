// import bodyParser from "body-parser";
// import { db } from "./datasource";
// import { userRoutes } from "./routes/user.Route";
// import { postRoutes } from "./routes/post.routes";
// import { authenticateToken } from "./middleware/userAuth.middleware";
// import { postController } from "./controllers/post.Controller";
// import cors from "cors";
// const { bodyParser } = require("body-parser");
const { db } = require("./datasource");
const { userRoutes } = require("./routes/user.Route");
const { postRoutes } = require("./routes/post.routes");
const { postController } = require("./controllers/post.Controller");
const cors = require("cors");
const express = require("express");
const app = express();
const bodyParser = express;

require("dotenv").config();
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Set up the user router(for login and registration)
const user_router = require("./routes/user.Route");
app.use("/register", userRoutes.userRegisterRouter);
app.use("/login", userRoutes.userLoginRouter);

// For post creation
app.use("/post", postRoutes.postRouter);
app.use("/posts", postController.listPosts);

app.use("/user/post", postRoutes.userPostRouter);
app.use("/logout", userRoutes.userLogoutRouter);
app.use("/profile", userRoutes.userProfileRouter);
app.use("/profile/me", userRoutes.meRouter);
app.use("/profile/:id", userRoutes.userRegisterRouter);

// app.get("/profile", auth_token,(req, res)=>{
//     const user = req['user'];
//     console.log(user.user_id);
//     res.json(user);
// });

console.log(process.env.PORT);
app.listen(process.env.PORT || 3000, async () => {
  try {
    await db.initialize();
  } catch (err) {
    console.log(err);
  }
  console.log(`Server runnng at port ${process.env.PORT}`);
});
