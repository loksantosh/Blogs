const AuthorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")
const passValidator = require('password-validator');
const emailValidator = require('email-validator')
const nodemailer = require("nodemailer")



const createAuthor = async function (req, res) {
    try {
        const author = req.body
        if (Object.keys(author).length == 0) {
            return res.status(400).send({ status: false, msg: "Invalid request Please provide valid Author  details" });
        }

        if (!author.Fname) return res.status(400).send({ msg: " First name is required " })
        if (!author.Lname) return res.status(400).send({ msg: " Last name is required " })
        if (!author.email) return res.status(400).send({ msg: " email is required " })
        if (!author.password) return res.status(400).send({ msg: " password is required " })
        let titleEnum = ['Mr', 'Mrs', 'Miss']

        if (!titleEnum.includes(author.title)) {
            res.status(400).send({ status: false, msg: "title should be Mr, Mrs or Miss" })
        }

        if (!emailValidator.validate(author.email)) {
            return res.status(400).send({ status: false, msg: "Check the format of the given email" })
        }

        const emailValidation = await AuthorModel.findOne({ email: author.email })
        if (emailValidation) {
            return res.status(409).send({ status: false, msg: "This  email  already exists " })
        }

        const schema = new passValidator();
        schema.is().min(6)
        if (!schema.validate(author.password)) {
            return res.status(400).send({ status: false, msg: "minimum length of password should be 6 characters" })
        }
        schema.is().max(12)
        if (!schema.validate(author.password)) {
            return res.status(400).send({ status: false, msg: "max length of password should be 12 characters" })
        }

        schema.has().not().spaces()
        if (!schema.validate(author.password)) {
            return res.status(400).send({ status: false, msg: "space not allowed in password" })
        }

        const authorCreated = await AuthorModel.create(author)

        const transporter = nodemailer.createTransport({
            service: "hotmail",
            auth: {
                user: "blogprojecttesting@outlook.com",
                pass: "Blog12345@"
            }
        })
        const Options = {
            from: "blogprojecttesting@outlook.com",
            to: author.email,
            subject: "User Created Sucessfully",
            text: "Congratulation , your account has been created"

        }

        transporter.sendMail(Options, function (error) {
            if (error) console.log(error)
            return
        })
        res.status(201).send({ status: true, data: authorCreated })
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}

//------------------------------------------------------------loginApi--------------------------------------------------------------------------------------------

const loginAuthor = async function (req, res) {
    try {
        const author = req.body
        const { email, password } = author
        if (Object.keys(author).length == 0) {
            return res.status(400).send({ status: false, msg: "Invalid request Please provide valid Author  details" });
        }

        if (author.length == 0) {
            return res.status(400).send({
                status: false,
                msg: "please provide login details",
            });
        }

        if (!email) return res.status(400).send({ msg: " email is required " })
        if (!password) return res.status(400).send({ msg: "  password is required " })


        const loggedAuthor = await AuthorModel.findOne({ email: email, password: password })
        if (!loggedAuthor) return res.status(400).send({ msg: "Email or Password is Incorrect!" })


        const token = jwt.sign(
            {
                authorId: loggedAuthor._id.toString(),
                batch: "Radon",
                project: "Blog-Project"
            },
            "Excellence Over Success", { expiresIn: '12h' }
        )

        res.status(200).send({ status: true, msg: "User logged in successfully!", loggedAuthor, token })
    } catch (error) {
        res.status(500).send({ msg: error.message })
    }
}


module.exports = {createAuthor ,loginAuthor}
