import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true, 
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
            'Please fill a valid email address',
          ]
          
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    birthDate: {
        type: Date,
        min: '1900-01-01',
        max: Date.now, 
    },
    profile: String,
    password: {
        type: String,
        required: false,
      },
    googleId: String,
      
});

const User = model('User', userSchema); 

export default User;