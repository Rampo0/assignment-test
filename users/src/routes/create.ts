import express, { Request , Response } from "express"

const route = express.Router();

route.post('/api/v1/users', async (req : Request , res : Response) => {
    res.status(201).send({});
});

export { route as createUsersRoute }