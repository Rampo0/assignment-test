import express from "express";
import 'express-async-errors';
import { createUsersRoute } from "./routes/create";
import { indexUsersRoute } from "./routes/index";
import { deleteUsersRoute } from "./routes/delete";
import { updateUsersRoute } from "./routes/update";
import { json } from "body-parser";
import { errorHandler, currentUser } from "@sejutacita/shared"
import { NotFoundError } from "@sejutacita/shared";

const app = express();

app.use(json());

app.use(currentUser);

app.use(createUsersRoute);
app.use(indexUsersRoute);
app.use(deleteUsersRoute);
app.use(updateUsersRoute);

app.all('*', async (req , res) => { 
    throw new NotFoundError(); 
});

// middlewares
app.use(errorHandler);

export { app }