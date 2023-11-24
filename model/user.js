import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required : false,
        },
        role: {
            type: String,
            required: true,
            enum:["Tuteur","Etudiant"],
            default:"Etudiant",
        },
        dateOfBirth: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        experienceMonths: {
        type: Number,
     
        },
        certificates: {
        type: String,
       
        },
        latitude: {
        type: Number,
        
         },
        longitude: {
        type: Number,
        
         },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("user", userSchema);
export { User };
