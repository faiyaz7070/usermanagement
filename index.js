const express=require("express")
const bodyParser = require('body-parser');
const connection=require("./config/db")
const router=require("./routes/user")

require("dotenv").config()
const app=express()

app.use(bodyParser.json());
app.use(router)





const PORT = process.env.PORT || 3000;
app.listen(PORT, async() => {
    try {
        await connection
        console.log("connected to db");
    } catch (error) {
        console.log(error);
    }
  console.log(`Server is running on port ${PORT}`);
});
