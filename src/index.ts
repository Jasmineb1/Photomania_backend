import bodyParser from "body-parser";
import { db } from "./datasource";
import { user_routes } from "./routes/user.Route";
import { postRoutes } from "./routes/post.routes";
import { authenticateToken } from "./middleware/userAuth.middleware";
import { postController } from "./controllers/post.Controller";
import cors from "cors";
const express = require("express");
const app = express();

require("dotenv").config();
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Set up the user router(for login and registration)
const user_router = require("./routes/user.Route");
app.use("/register", user_routes.user_register_router);
app.use("/login", user_routes.user_login_router);

// For post creation
app.use("/post", postRoutes.post_router);
app.use("/posts", postController.listPosts);

app.use("/user/post", postRoutes.userPostRouter);
app.use("/logout", user_routes.user_logout_router);

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
