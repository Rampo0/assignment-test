import express, {Request , Response} from "express";
import { User } from "../models/user";
import { RefreshToken } from "../models/refresh-token";
import { BadRequestError } from "@sejutacita/shared";
import jwt from "jsonwebtoken";
import { Password } from "../utils/password";

const route = express.Router();

route.post("/api/v1/auth/token", async (req : Request, res : Response) => {
    
    const { email, password } = req.body;
    const user = await User.findOne({email});

    if(!user){
        throw new BadRequestError("Invalid Credentials");
    }

    const passwordMatch = await Password.compare(user.password , password);
    if(!passwordMatch){
        throw new BadRequestError("Invalid Credentials");
    }

    const payload = { id : user.id , name : user.name, email : user.email, role : user.role };
    const accessToken = jwt.sign( payload , process.env.JWT_KEY!, { expiresIn : "5m" } );
    const refreshToken = jwt.sign( payload, process.env.JWT_REFRESH_KEY! );

    const storeRefreshToken = RefreshToken.build({refreshToken, userId : user._id });
    await storeRefreshToken.save();

    return res.status(200).send({ message : "success", access_token : accessToken, refresh_token : refreshToken });
});

export { route as obtainTokenRoute }