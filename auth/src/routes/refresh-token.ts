import express, {Request , Response} from "express";
import { RefreshToken } from "../models/refresh-token";
import { NotAuthorizedError, NotFoundError } from "@sejutacita/shared";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

interface UserPayload { id :string , email : string , name : string, role : string }
const route = express.Router();

route.post("/api/v1/auth/refresh-token", async (req : Request, res : Response) => {
    
    const { token } = req.body;
    const refreshTokenExists = await RefreshToken.findOne({ refreshToken : token });
    if(!refreshTokenExists){ throw new NotAuthorizedError() }
    
    const payload = jwt.verify(token , process.env.JWT_REFRESH_KEY! ) as UserPayload;
    if(!payload) { throw new NotAuthorizedError() }
    
    const user = await User.findById(payload.id);
    if(!user){ throw new NotFoundError() };

    const accessToken = jwt.sign({ id : user.id, email : user.email , name: user.name, role : user.role}, process.env.JWT_KEY!, { expiresIn : "5m" } );
    return res.status(200).send({access_token : accessToken});
});

export { route as refreshTokenRoute }