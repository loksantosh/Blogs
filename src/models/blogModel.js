const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    authorId: {
        type: ObjectId,
        ref: "Author",
        required: true,
        trim: true
    },
    tags: {
        type: [String],
        trim: true
    },
    category: {
        type: [String],
        required: true,
        trim: true
    },
    subCategory: {
        type: [String],
        trim: true
    },

    deletedAt: Date,

    isDeleted: {
        type: Boolean,
        default: false,
    },

    publishedAt: Date,

    isPublished: {
        type: Boolean,
        default: false,
        required:true ,
        },


}, { timestamps: true });


module.exports = mongoose.model('Blog', blogSchema)