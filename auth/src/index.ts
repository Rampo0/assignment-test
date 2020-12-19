import { app } from "./app";
import mongoose from "mongoose";

const start = async () => {

    if(!process.env.MONGO_URI){
        throw new Error("Environment MONGO_URI not found.");
    }

    if(!process.env.JWT_KEY){
        throw new Error("Environment JWT_KEY not found.");
    }

    if(!process.env.JWT_REFRESH_KEY){
        throw new Error("Environment JWT_REFRESH_KEY not found.");
    }

    try{
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser : true,
            useUnifiedTopology : true,
            useCreateIndex : true
        });

        console.log("Connected to MongoDB.");
    }catch(err){
        console.error(err)
    }

    app.listen("3000", () => {
        console.log("Listening to port 3000")
    });
}

start();

