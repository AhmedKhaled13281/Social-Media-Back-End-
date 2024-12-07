const express = require("express")
const app = require("./app")
const connectToDB = require("./Config/mongoDb.config")
const dotenv = require('dotenv')
dotenv.config({path : "./.env"})


process.on('uncaughtException' , (err) => {
    console.log("UnCaughtException : ");
    console.log(err.name , err.message);
    process.exit(1)
})

// MongoDB Connection
connectToDB()


app.listen(process.env.PORT , () => {
    console.log("Server is Running!");
})

process.on('unhandledRejection' , (err) => {
    console.log("Unhandled Rejection :");
    console.log(err.name , err.message);
    process.exit(1)
})