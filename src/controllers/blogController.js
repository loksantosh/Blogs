const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const mongoose = require('mongoose');


const createBlog = async (req, res) => {
    try {
       const Blog = req.body
        if (Object.keys(Blog).length == 0) {
            return res.status(400).send({ status: false, msg: "Invalid request Please provide valid Author  details" });
        }
        if (!Blog.title) return res.status(400).send({ msg: " title is required " })
        if (!Blog.body) return res.status(400).send({ msg: "body is required " })
        if (!Blog.authorId) return res.status(400).send({ msg: " authorId is required " })
        if (!Blog.category) return res.status(400).send({ msg: " category is require" })
        if (Blog.isPublished == true) return res.status(400).send({ msg: " isPublished should be false" })
        const isValid = mongoose.Types.ObjectId.isValid(Blog.authorId)
        if (!isValid) return res.status(400).send({ status: false, msg: "enter valid objectID" })

        const checkAuthor = await authorModel.findById(Blog.authorId)
        if (!checkAuthor) return res.status(404).send({ status: false, msg: "Author not found" })

        const blogCreated = await blogModel.create(Blog)

        res.status(201).send({ status: true, data: blogCreated })
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}



//--------------------------------------------------------GetApi---------------------------------------------------------------------------------------------

const getBlogsData = async (req, res) => {
    try {

        const input = req.query
        if (input) {

           
            const  blogs = await blogModel.find(input).populate('authorId')
            const newBlog= blogs.filter(n => { if (n.isDeleted == false && n.isPublished == true) return n })
            if (!blogs || blogs.length == 0) return res.status(404).send({ msg: "no blog found" })
                
            return res.status(200).send({ data: newBlog })
        }

        else {
            
            const  blogs = await blogModel.find({ isDeleted: false, isPublished: true }).populate('authorId')
            if (blogs.length == 0) return res.status(404).send({ msg: "no blog found" })
            return res.status(200).send({ data: blogs })
        }
               

    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

//---------------------------------------------------------------------------------------------------------------------------------------------------

const updateBlog = async (req, res) => {
    try {
        const inputId = req.params.blogId
        const isValid = mongoose.Types.ObjectId.isValid(inputId)
        if (!isValid) return res.status(400).send({ status: false, msg: "enter valid objectID" })

        const author = req.body
        const { title, body, tags, subCategory } = author

        if (Object.keys(author).length == 0) {
            return res.status(400).send({ status: false, msg: "Invalid request Please provide valid  details in body" });
        }

        const date = Date.now()
        const alert1 = await blogModel.findById(inputId)
        if (!alert1) return res.status(404).send({ status: false, msg: " No Blog found" })
        const alert = await blogModel.findOne({ _id: inputId, isDeleted: true })
        if (alert) return res.status(400).send({ status: false, msg: "Blog already deleted" })

        const blogs = await blogModel.findOneAndUpdate({ _id: inputId },
            { $set: { title: title, body: body, isPublished: true, publishedAt: date }, $push: { tags: tags, subCategory: subCategory } }, { new: true })


        if (!blogs) return res.status(404).send({ status: false, msg: "no blog found" })
        res.status(200).send({ status: true, msg: blogs })
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


//-----------------------------------------------------deleteAPI's--------------------------------------------------------------------------------------------

const deleteBlog = async (req, res) => {
    try {
        const inputId = req.params.blogId

        const isValid = mongoose.Types.ObjectId.isValid(inputId)
        if (!isValid) return res.status(400).send({ status: false, msg: "enter valid objectID" })
        const date = Date.now()

        const alert = await blogModel.findOne({ _id: inputId, isDeleted: true })
        if (alert) return res.status(409).send({ status: false, msg: "Blog already deleted" })

        const data = await blogModel.findOneAndUpdate({ _id: inputId },
            { $set: { isDeleted: true, deletedAt: date } }, { new: true })

        if (!data) return res.status(404).send({ status: false, msg: "no data found" })

        res.status(200).send({ status: true, msg: data })
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}



const deleteBlogQuery = async (req, res) => {
    try {
        const inputData = req.query

        // let isValid = mongoose.Types.ObjectId.isValid(req.query.authorId)
        // if (!isValid) return res.status(400).send({ status: false, msg: "enter valid objectID" })

        const date = Date.now()

        if (Object.keys(inputData).length == 0) {
            return res.status(400).send({ status: false, msg: "Invalid request Please provide valid blog details in Query" });
        }

        const blogs = await blogModel.updateMany((inputData), { $set: { isDeleted: true, deletedAt: date } }, { new: true })

        if (!blogs) return res.status(404).send({ status: false, msg: "no data found" })
        res.status(200).send({ status: true, msg: blogs })
    }
    catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


module.exports = { createBlog, getBlogsData, updateBlog, deleteBlog, deleteBlogQuery }
