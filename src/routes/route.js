const express = require('express');
const router = express.Router();



const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const mController = require("../middleware/middleware")




router.post("/authors", authorController.createAuthor)

router.post("/blogs",mController.authenticate, blogController.createBlog)

router.get("/blogs",mController.authenticate,blogController.getBlogsData)

router.put("/blogs/:blogId", mController.authorize ,blogController.updateBlog)

router.delete("/blogs/:blogId", mController.authorize, blogController.deleteBlog)

router.delete("/blogs",mController.authorize,blogController.deleteBlogQuery)

router.post("/login", authorController.loginAuthor)

router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "The api you request is not available"
    })
})



module.exports = router;


