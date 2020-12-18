import express from "express";
import { createUsersRoute } from "./routes/create";

const app = express();

app.use(createUsersRoute)

export { app }