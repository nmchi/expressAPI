import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription, getUserSubscriptions } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
    res.send({ title: "Get All Subscription" });
});

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

export default subscriptionRouter;