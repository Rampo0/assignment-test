import express, { Request , Response } from "express"
import { User } from "../models/user";
import { body } from "express-validator";
import { validateRequest ,BadRequestError, requireAuth, admin } from "@sejutacita/shared";

const route = express.Router();

route.post('/api/v1/users', [
    body("email")
        .isEmail()
        .withMessage("Email must be valid."),
    body("password")
        .trim()
        .isLength({min : 6, max : 20})
        .withMessage("Password must be valid."),
    body("name")
        .notEmpty()
        .withMessage("Name must not empty.")

], requireAuth, admin, validateRequest, async (req : Request , res : Response) => {

    const { email , password, name } = req.body;

    const userExists = await User.findOne({email});
    if(userExists){
        throw new BadRequestError("Email in use");
    }

    const user = User.build({
        email,
        password,
        name
    })

    await user.save();

    res.status(201).send(user);
});

export { route as createUsersRoute }