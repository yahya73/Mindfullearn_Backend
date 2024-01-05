import express from "express";
import userController from "../controller/userController.js";
import postController from "../controller/postController.js";
import middleware from "../Midlleware/midd.js";
import { fetchconversations,getAllMessages,addOnceMessage,deleteOnceMessage,getOnceMessage ,getAllSessions2,Updatesessions2,getMessagesBySenderAndRecipient} from '../controller/messageController.js';
//import {getAllSessions,Updatesessions} from "../controller/SessionsController.js";

const router = express.Router();

router.post("/user/add",userController.createUser);
router.put("/user/update/:id", userController.updateUser);
router.get("/user/find/:id", userController.fetchUser);
router.get("/sessions/getallsessions", getAllSessions2);
router.get("/users",middleware.verifyTokenAndAdmin, userController.fetchAllUsers);
router.put("/users/:id/ban", userController.toggleBannedStatus);
router.get('/Sorted', postController.getAllPostsSorted);
router.get('/reelsSorted', postController.getAllPostsByTypeSorted);

router.get("/tuteur", userController.findtuteur); // Corrected function name
 // Corrected function name
 router.post("/user/forgotpassword/sendcode", userController.forgotPassword_SendCode)
router.post("/user/forgotpassword/getcode", userController.forgotPassword_GetCode)
router.put("/user/password", userController.ChangePassword);
router.put("/sessions/updatesessions", Updatesessions2);
router.delete("/user/:id", middleware.verifyTokenAndAdmin,userController.deleteUser);
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
router.put('/posts/:postId', postController.updatePost);

// Delete a post by ID
router.delete('/posts/:postId', postController.deletePost);
router.post('/posts/', postController.createPost);

// Get all posts
router.get('/posts/', postController.getAllPosts);
router.get('/posts/reels', postController.getAllPostsByType);



// Get a post by ID
router.get('/posts/:postId', postController.getPostById);

router.put('/posts/:postId/comments/:commentId',postController.updateCommentInPost)
router.post('/posts/:postId/comments', postController.addCommentToPost);
router.delete('/posts/:postId/comments/:commentId', postController.deleteCommentFromPost);
router.put('/posts/:postId/:iuserId/like', postController.likePost);

export default router;
