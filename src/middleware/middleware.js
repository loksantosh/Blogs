const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel")

const authenticate = function (req, res, next) {
  try {
    const token = req.headers["x-api-key"];
    if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
    const decodedToken = jwt.verify(token, "Excellence Over Success");

    if (!decodedToken) return res.status(401).send({ status: false, msg: "token is invalid" });

    next()
  }
  catch (error) {
    res.status(500).send({ msg: error.message })
  }
}


//------------------------------------------------------Authorization------------------------------------------------------------------------------------

const authorize = async function (req, res, next) {
  try {
    const token = req.headers["x-api-key"];
    const inputId = req.params.blogId
   const newInput = req.query.authorId
   let  userTobeModified
    if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
    const decodedToken = jwt.verify(token, "Excellence Over Success");
    if (!decodedToken)
      return res.status(401).send({ status: false, msg: "token is invalid" });
    const userLoggedIn = decodedToken.authorId

    if (inputId) {
      const author = await blogModel.findOne({ _id: inputId })
      if (!author) return res.status(404).send({ status: false, msg: "No Blog found" });
       userTobeModified = author.authorId.toString()
    }

    else {
       userTobeModified = newInput
    }

    if (userTobeModified != userLoggedIn) return res.status(403).send({ status: false, msg: "You are not Authorized" })

    next()
  } catch (error) {
    res.status(500).send({ msg: error.message })
  }
}









module.exports = {authenticate,authorize}
