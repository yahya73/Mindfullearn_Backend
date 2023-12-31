import { User } from "../model/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {sendForgotPasswordEmail, sendTestEmail} from "../utils/emailService.js";
const userController = {
    createUser: async (req, res) => {
        try {
            const {
                firstname,
                lastname,
                email,
                image,
                role,
                dateOfBirth,
                password,
            } = req.body;

            const user = await User.create({
                firstname,
                lastname,
                email,
                image,
                role,
                dateOfBirth,
                password: await bcrypt.hash(password, 10),
            });

            await user.save();

            return res.status(201).json({
              
                user: user,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
            });
        }
    },

    updateUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const {
                firstname,
                lastname,
                email,
                image,
                role,
                dateOfBirth,
                password,
                latitude,
                longitude,
            } = req.body;

            if (!userId) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "userId is required for updating a user",
                });
            }

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "User not found",
                });
            }
             if(user.role == "Tuteur"){
                user.firstname = firstname || user.firstname;
                user.lastname = lastname || user.lastname;
                user.email = email || user.email;
                user.image = image || user.image;
                user.role = role || user.role;
                user.dateOfBirth = dateOfBirth || user.dateOfBirth;
                user.password = password || user.password;
                user.latitude = latitude || user.latitude;
                user.longitude = longitude || user.longitude;
                await user.save();
             }
             else{
            user.firstname = firstname || user.firstname;
            user.lastname = lastname || user.lastname;
            user.email = email || user.email;
            user.image = image || user.image;
            user.role = role || user.role;
            user.dateOfBirth = dateOfBirth || user.dateOfBirth;
            user.password = password || user.password;

            await user.save();
             }
            return res.status(200).json({
                statusCode: 200,
                message: "User updated",
                user: user,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
            });
        }
    },
    fetchUserAdmin: async (req, res) => {
        try {
            console.log(req.body.email)
            const email = req.body.email;

            const user = await User.findOne({email});
            console.log(user)

            if (!user) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "User not found",
                });
            }

            return res.status(200).json({
                statusCode: 200,
                message: "User fetched successfully",
                role: user.role,
                _id : user.id,
                firstname : user.firstname,
                lastname : user.lastname,
                email : user.email,
                image : user.image,
                dateOfBirth : user.dateOfBirth,
                password : user.password,
                createdAt : user.createdAt,
                updatedAt : user.updatedAt,
                __v : user.__v.toString()



            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
            });
        }
    },

    fetchUser: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "User not found",
                });
            }

            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
            });
        }
    },

    fetchAllUsers: async (req, res) => {
        try {
            const users = await User.find();

            return res.status(200).json({
                statusCode: 200,
                message: "All users fetched successfully",
                users: users,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
            });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id;
            console.log("User ID to delete:", userId);
    
            const user = await User.findById(userId);
            console.log("User to delete:", user);
    
            if (!user) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "User not found",
                });
            }
    
            // Instead of await user.remove(), you can use:
            // await User.findByIdAndRemove(userId);
            await User.findByIdAndRemove(userId);
    
            return res.status(200).json({
                statusCode: 200,
                message: "User deleted successfully",
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                statusCode: 500,
                message: "Internal server error",
            });
        }
    },
    
    login: async (req, res) => {
        const {email, password} = req.body;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: "User not found",
            });
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                statusCode: 401,
                message: "Wrong password",
            });
        }

        const token = jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: "1d"});

       // sendTestEmail();

        return res.status(200).json({
            statusCode: 200,
            message: token.toString(),
            role: user.role,
            __id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            image: user.image,
            dateOfBirth: user.dateOfBirth,
            password: user.password,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            
            __v: user.__v.toString()
        });
    },

    findtuteur :async (req,res) => {
        try {
            const tuteurUsers = await User.find({ role: 'Tuteur' }); // Fetch users with 'Tuteur' role
            return res.json(tuteurUsers);
        } catch (error) {
           return res.status(500).json({ message: error.message });
        }
    
     },
 
     
       
         forgotPassword_SendCode: async (req, res) => {
             const {email} = req.body;
     
             try {
                 const user = await User.findOne({email});
                 if (!user)
                     return res.status(404).json({
                         statusCode: 404,
                         message: "User not found",
                     });
                 const randCode = sendForgotPasswordEmail(email)
                 await User.updateOne({email}, {code: randCode});
     
                 return res.status(200).json(
                     
                     randCode.toString()
                 );
     
             } catch (error) {
                 console.error(error);
                 return res.status(500).json({
                     statusCode: 500,
                     message: "Internal server error",
                 });
             }
         },
         forgotPassword_GetCode : async (req, res) =>{
             const {email, password, code} = req.body;
     
             try {
                 const user = await User.findOne({email});
     
                 if (!user) {
                     return res.status(404).json({
                         statusCode: 404,
                         message: "User not found",
                     });
                 }
     
                 if (user.code !== code) {
                     return res.status(401).json({
                         statusCode: 401,
                         message: "Wrong code",
                     });
                 }
     
                 await User.updateOne({email}, {password: await bcrypt.hash(password, 10), $unset: {code: 1}});
     
                 return res.status(200).json({
                     statusCode: 200,
                     message: "Password resetted successfully",
                 });
     
             } catch (error) {
                 console.error(error);
                 return res.status(500).json({
                     statusCode: 500,
                     message: "Internal server error",
                 });
             }
         },
        ChangePassword: async (req, res) =>{
         try {
             console.log(req.body)
             const {email, password} = req.body;
             console.log(password)
             const user = await User.findOne({email});
             user.password = await bcrypt.hash(password, 10);
             await user.save();
     
             return res.status(200).json({
                 statusCode: 200,
                 message: "password changed",
                 
             });
     
            } catch (error) {
             console.error(error);
             return res.status(500).json({
                 statusCode: 500,
                 message: "Internal server error",
             });
         }
     }
      
};



export default userController;
