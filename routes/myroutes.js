import express from "express";
import userController from "../controller/userController.js";
import { getAllMessages,addOnceMessage,deleteOnceMessage,getOnceMessage } from '../controller/messageController.js';

const router = express.Router();

router.post("/user/add", userController.createUser);
router.put("/user/update/:id", userController.updateUser);
router.get("/user/find/:id", userController.fetchUser);
router.get("/users", userController.fetchAllUsers);
router.get("/tuteur", userController.findtuteur); // Corrected function name
 // Corrected function name
 router.post("/user/forgotpassword/sendcode", userController.forgotPassword_SendCode)
router.post("/user/forgotpassword/getcode", userController.forgotPassword_GetCode)
router.put("/user/password", userController.ChangePassword);

router.delete("/user/:id", userController.deleteUser);
router.post("/user/login", userController.login)
router
.route('/message/')
.get(getAllMessages)
.post(addOnceMessage);
router
.route('/message/:content')
.get(getOnceMessage)
.delete(deleteOnceMessage);
export default router;
