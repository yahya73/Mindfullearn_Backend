import pkg from 'jsonwebtoken';
import { Admin } from 'mongodb';
const {jwt} = pkg;
const middleware={
    
 async verifyToken (req, res, next) {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, async (err, user) => {
            if (err) res.status(403).json("Invalid token");
            req.user = user;
            // req.user = await User.findById(user.id);
            // console.log(req.user)
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
},



async verifyTokenAndAuthorization  (req, res, next)  {
    verifyToken(req, res, () => {
        if (req.user.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are restricted from perfoming this operation");
        }
    });
},

async verifyTokenAndAdmin (req, res, next)  {
    verifyToken(req, res, () => {
        if (req.user.role==="admin") {
            next();
        } else {
            res.status(403).json("You have limited access");
        }
    });
},


async verifyTokenAndTuteur (req, res, next)  {
    verifyToken(req, res, () => {
        if (req.user.role==="tuteur") {
            next();
        } else {
            res.status(403).json("You are restricted from perfoming this operation");
        }
    });
},

async verifyTokenAndEtudiant  (req, res, next)  {
    verifyToken(req, res, () => {
        if (req.user.role==="etudiant") {
            next();
        } else {
            res.status(403).json("You are restricted from perfoming this operation");
        }
    });
},



}



export default middleware;