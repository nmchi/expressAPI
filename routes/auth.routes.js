import { Router } from "express";
import { signup, signin, signout } from "../controllers/auth.controller.js";

const authRouter = Router();

// Path: /api/v1/auth
authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/signout", signout);

export default authRouter;