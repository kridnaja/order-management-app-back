const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = require('../models/prisma')

exports.register = async (req, res, next) => {
  try {

    let userData = req.body
    userData.password = await bcrypt.hash(userData.password, 5);

    const userAfterCreated = await prisma.user.create({
      data: {
        username: userData.username,
        password: userData.password,
        role: "SALES",
      },
    });
    const payload = { userId: userAfterCreated.id };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || "sdd", {
      expiresIn: "1d",
    });
    delete userAfterCreated.password;
     res.status(201).json({ accessToken, userAfterCreated });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res, next) => {
    try {
            console.log(req.body)
const userData = { username: "eva@admin.com", password: "1234" }

    const userAfterLogin = await prisma.user.findFirst({
        where:{
            username: userData.username,

        }
    })
    console.log("userAfterLogin",userAfterLogin)
    if(!userAfterLogin) {
        return res.status(404).json({error: "User not found"})
    }

    const isMatch = await bcrypt.compare(userAfterLogin.password,userData.password)
    if(!isMatch){
        return res.status(404).json({error: "User not found"}) 
    }

    const payload = { userId: userAfterLogin.id}
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || "asdasd", { expiresIn : "1d"})
   
    delete userAfterLogin.password
    return res.status(200).json({accessToken, userAfterLogin })
} catch (error) {
        console.log(error)
    }
}