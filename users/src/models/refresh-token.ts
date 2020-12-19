import mongoose from 'mongoose';
import { Password } from '../utils/password';
import { Roles } from './roles';

interface RefreshTokenAttrs {
    refreshToken : string;
    userId : string;
}

interface RefreshTokenDoc extends mongoose.Document{
    refreshToken : string;
    userId : string;
}

interface RefreshTokenModel extends mongoose.Model<RefreshTokenDoc> {
    build(attrs : RefreshTokenAttrs) : RefreshTokenDoc;
}

const refreshTokenSchema = new mongoose.Schema({
    refreshToken : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true
    },
}, {
    toJSON : {
        transform(doc , ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
})

refreshTokenSchema.statics.build = (attrs : RefreshTokenAttrs) => {
    return new RefreshToken(attrs);
}

const RefreshToken = mongoose.model<RefreshTokenDoc , RefreshTokenModel>('RefreshToken' , refreshTokenSchema);

export { RefreshToken };