import { NextFunction, Request , Response } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

export const admin = ( req : Request , res : Response , next : NextFunction ) => {
    if(req.currentUser?.role != "admin"){
        throw new NotAuthorizedError();
    }

    return next();
}