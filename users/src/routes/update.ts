import express, {Request , Response} from "express";
import { User } from "../models/user";
import { NotFoundError, validateRequest } from "@sejutacita/shared";
import { body } from "express-validator";
import { requireAuth, admin } from "@sejutacita/shared";

const route = express.Router();

route.put("/api/v1/users/:userId",[
    body("name")
        .notEmpty()
        .withMessage("Name field should not be empty.")
        
], requireAuth, admin, validateRequest, async (req : Request, res : Response) => {
    
    const { name } = req.body;

    const user = await User.findById(req.params.userId);
    if(!user){
        throw new NotFoundError();
    }

    user.set({
        name
    });

    await user.save();

    return res.status(200).send(user);
});

export { route as updateUsersRoute }