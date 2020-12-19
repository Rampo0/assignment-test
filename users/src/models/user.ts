import mongoose from 'mongoose';
import { Password } from '../utils/password';
import { Roles } from './roles';

interface UserAttrs {
    email : string;
    password : string;
    name : string;
    role? : string;
}

interface UserDoc extends mongoose.Document{
    email : string;
    password : string;
    name : string;
    role? : Roles;
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs : UserAttrs) : UserDoc;
}

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true,
        enum : Object.values(Roles),
        default : Roles.User,
    }
}, {
    toJSON : {
        transform(doc , ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
            delete ret.role;
        }
    }
})

userSchema.pre('save' , async function(done){
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password' , hashed);
    }
    done();
})

userSchema.statics.build = (attrs : UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc , UserModel>('User' , userSchema);

export { User };