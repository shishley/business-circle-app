import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router(); /*allow routes to be configured  */

router.post("/login", login);

export default router;