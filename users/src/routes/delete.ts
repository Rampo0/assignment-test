import express, {Request , Response} from "express";
import { User } from "../models/user";
import { NotFoundError } from "@sejutacita/shared";
import { requireAuth, admin } from "@sejutacita/shared";

const route = express.Router();

route.delete("/api/v1/users/:userId", requireAuth, admin, async (req : Request, res : Response) => {
    
    const user = await User.findById(req.params.userId);
    if(!user){
        throw new NotFoundError();
    }

    await user.delete();

    return res.status(200).send({ message : "success" });
});

export { route as deleteUsersRoute }