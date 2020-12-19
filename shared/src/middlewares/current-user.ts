import jwt from 'jsonwebtoken';
import { NextFunction, Request , Response } from 'express';

interface UserPayload { id :string , email : string , name : string, role : string }

declare global{
    namespace Express{
        interface Request{
            currentUser? : UserPayload
        }
    }
}

export const currentUser = ( req : Request , res : Response , next : NextFunction ) => {
   
    const headers = req.headers['authorization'];
    if (!headers){ return next(); }
    const [tokenPrefix , token] = headers!.split(' ');
    if(tokenPrefix != "Bearer") { return next(); }

    try{
        const payload = jwt.verify(token ,  process.env.JWT_KEY!) as UserPayload;
        req.currentUser = payload;
    }catch(err) { }

    next();
}