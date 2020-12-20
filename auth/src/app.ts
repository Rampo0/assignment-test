import express from "express";
import 'express-async-errors';
import { obtainTokenRoute } from "./routes/obtain-token";
import { refreshTokenRoute } from "./routes/refresh-token";
import { json } from "body-parser";
import { errorHandler, currentUser } from "@sejutacita/shared"
import { NotFoundError } from "@sejutacita/shared";

const app = express();

app.use(json());

app.use(currentUser);

app.use(obtainTokenRoute);
app.use(refreshTokenRoute);

app.all('*', async (req , res) => { 
    throw new NotFoundError(); 
});

// middlewares
app.use(errorHandler);

export { app }