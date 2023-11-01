
const jwt=require("jsonwebtoken")
require("dotenv").config()

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ status: 401, message: 'Invalid or expired token' });
    }
  
    jwt.verify(token, process.env.secretkey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: 401, message: 'Invalid or expired token' });
      }
  
      req.userId = decoded.userId;
      next();
    });
  };
  module.exports=verifyToken