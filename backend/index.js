import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import {fileURLToPath} from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/*configuration  */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/*file storage config  */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");    /*when biz upload file, saves in this folder */
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage }); /*saves file */

  /*authentication routes with files */
app.post("/auth/register", upload.single("picture"), register);/*uploadpic locally into assets folder*/
app.post("/posts", verifyToken, upload.single("picture"), createPost); 

  
/* routes  */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);


  /* mongoose setup */
const PORT = process.env.PORT || 6001; /*backup if 3001 dont work */
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
 /* ADD DATA ONCE */
    // User.insertMany(users);
    // Post.insertMany(posts);
})
.catch((error) => console.log(`${error} did not connect`));


