const express = require("express")
const app = express()
const AppErrorHandler = require('./Utilities/appErrorHandler')
const UserRoute = require("./Routes/user.route")
const PostRoute = require("./Routes/post.route")
const LikeRoute = require("./Routes/like.route")

// Middleware and routes
app.use(express.json());

app.use("/user" , UserRoute)
app.use("/post" , PostRoute)
app.use("/like" , LikeRoute)


app.all('*' , (req, res , next) => {
    next(new AppErrorHandler(`This Route ${req.url} does not exist` , 404))
})

app.use((err , req, res , next) => {
    err.status = err.status || 'Error'
    err.statusCode = err.statusCode || 500

    res.status(err.statusCode).json({
        message : err.message,
        status : err.status
    })
})

module.exports = app