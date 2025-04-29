const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = require('../models/prisma')

exports.register = async (req, res, next) => {
  try {

    req.body.password = await bcrypt.hash(req.body.password, 12);

    const userAfterCreated = await prisma.user.create({
      data: {
        email:  req.body.email,
        password: req.body.password,
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
      const { email , password } = req.body
      const userAfterLogin = await prisma.user.findFirst({
        where:{
          email: email,
          
        }
      })
    
    if(!userAfterLogin) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password,userAfterLogin.password)
    if(!isMatch){
      return res.status(401).json({ error: "Invalid password" });
    }

    const payload = { userId: userAfterLogin.id}
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY || "asdasd", { expiresIn : "7d"})
   
    delete userAfterLogin.password
    const timeStampOrder = Date.now();
    await prisma.userLog.create({
      data:{
        loginOrLogout: "logged in",
        timeStamp: '' + timeStampOrder,
        userId : userAfterLogin.id
      }
    })
    
    if(userAfterLogin.role === "SALES"){
        await prisma.salesLog.create({
          data:{
            email: userAfterLogin.email,
            action: "logged in",
            timeStamp: '' + timeStampOrder,
          }
        })
    }
    if(userAfterLogin.role === "PREPRESS"){
        await prisma.prepressLog.create({
          data:{
            email: userAfterLogin.email,
            action: "logged in",
            timeStamp: '' + timeStampOrder,
          }
        })
    }

    return res.status(200).json({accessToken, userAfterLogin })
} catch (error) {
        console.error(error)
    }
}
exports.logout = async (req, res, next) =>{
  try {


    const timeStampOrder = Date.now();
    await prisma.userLog.create({
      data:{
        loginOrLogout: "logged out",
        timeStamp: '' + timeStampOrder,
        userId : +req.body.id
      }
    })

    if(req.body.role === "SALES"){
      await prisma.salesLog.create({
        data:{
          email: req.body.email,
          action: "logged out",
          timeStamp: '' + timeStampOrder,
        }
      })
  }
  if(req.body.role === "PREPRESS"){
      await prisma.prepressLog.create({
        data:{
          email: req.body.email,
          action: "logged out",
          timeStamp: '' + timeStampOrder,
        }
      })
  }
return res.status(200).json("logged out")
  } catch (error) {
    console.log(error)
  }
}
exports.getMe = async (req, res, next) =>{
  try {
    
  return  res.status(200).json(req.user)
  } catch (error) {
    console.log(error)
  }
}