const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { body, validationResult } = require('express-validator');
require("dotenv").config()
const verifyToken=require("../middleware/middleware")

const User = require("../models/model")
const router = express.Router()

router.post("/api/users/register", [
  
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
  ], async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ status: 400, errors: errors.array() });
      }
  
      const { first_name, last_name, email, mobile, password, role, status } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(501).json({ status: 501, message: 'Email already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newuser = new User({ first_name, last_name, email, mobile, password: hashedPassword, role, status });
      await newuser.save();
  
      res.json({ status: 200, message: 'Account successfully created' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
  });
router.post("/api/users/login", async (req, res) => {
    try {
        const {email,role,password}=req.body
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(501).json({ status: 501, message: 'Invalid email or role' });
        }

        // Validate the password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(501).json({ status: 501, message: 'Invalid password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.secretkey, { expiresIn: '30d' });

        res.json({
            status: 200,
            message: 'Logged in successfully',
            data: {
                userDetails: {
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    mobile: user.mobile,
                    role: user.role,
                    status: user.status,
                },
                token,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }

})
router.get("/api/users/details",verifyToken, async(req,res)=>{
    try {
        const user = await User.findById(req.userId);
  
        if (!user) {
          return res.status(404).json({ status: 404, message: 'User not found' });
        }
  
        res.json({
          status: 200,
          data: {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            status: user.status,
          },
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
      }

})
router.get("/api/users", async(req,res)=>{
    try {
        const filters = req.query;
        const users = await User.find(filters);
  
        res.json({ status: 200, data: users });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
      }
})
module.exports=router