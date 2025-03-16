import { Request, Response, NextFunction } from 'express';
import { User } from '../lib/Schema';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   try {
     const {email, password} = req.body;
 
     if(!email || !password){
         res.status(400).json({
             msg: 'Email and password are required'
         });
         return;
     }
 
     const user = await User.findOne({email});
 
     if(!user || user.password != password){
         res.status(400).json({
             msg: "Invalid Credentials"
         });
         return;
     }
 
     if(user.role != 'admin'){
         res.status(400).json({
             msg: "Unauthorized"
         });
         return;
     }
 
     const tokenData = {
         userId: user._id,
         email: user.email,
         role: user.role
     };
 
     const token = jwt.sign(tokenData, process.env.JWT_SECRET || '', { expiresIn: '24h' });
 
     // Set token in cookie which can be used to authenticate the user
     res.cookie('token', token, {
         httpOnly: true,
         maxAge: 24 * 60 * 60 * 1000,
         sameSite: 'strict'
     });
 
     res.json({
         msg: 'Login successful',
         token,
         user: {
             id: user._id,
             email: user.email,
             role: user.role
         }
     });
   } catch (error) {
       next(error);
   }
};