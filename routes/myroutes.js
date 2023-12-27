import express from "express";
import userController from "../controller/userController.js";
import { fetchconversations,getAllMessages,addOnceMessage,deleteOnceMessage,getOnceMessage ,getAllSessions2,Updatesessions2,getMessagesBySenderAndRecipient} from '../controller/messageController.js';
//import {getAllSessions,Updatesessions} from "../controller/SessionsController.js";

const router = express.Router();

router.post("/user/add", userController.createUser);
router.put("/user/update/:id", userController.updateUser);
router.get("/user/find/:id", userController.fetchUser);
router.get("/sessions/getallsessions", getAllSessions2);
router.get("/users", userController.fetchAllUsers);

router.get("/tuteur", userController.findtuteur); // Corrected function name
 // Corrected function name
 router.post("/user/forgotpassword/sendcode", userController.forgotPassword_SendCode)
router.post("/user/forgotpassword/getcode", userController.forgotPassword_GetCode)
router.put("/user/password", userController.ChangePassword);
router.put("/sessions/updatesessions", Updatesessions2);
router.delete("/user/:id", userController.deleteUser);
router.post("/useradmin", userController.fetchUserAdmin);
router.post("/user/login", userController.login)
router
.route('/message/')
.get(getAllMessages)
.post(addOnceMessage);
router
.route('/messages/:senderId/:recipientId')
.get(getMessagesBySenderAndRecipient)
router
.route('/message/:content')
.get(getOnceMessage)
.delete(deleteOnceMessage);
router
.route('/conversations/')
.post(fetchconversations);
export default router;
