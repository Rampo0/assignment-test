import express, {Request , Response} from "express";
import { User } from "../models/user";
import { requireAuth } from "@sejutacita/shared";

const route = express.Router();

route.get("/api/v1/users", requireAuth, async (req : Request, res : Response) => {
    const users = await User.find({});
    return res.status(200).send(users);
});

export { route as indexUsersRoute }