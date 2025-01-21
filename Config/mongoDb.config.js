const mongoose = require("mongoose")

const connectToDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
        console.log("MongoDB is Connected Successfully!");
        return connect.connection
    } catch (error) {
        console.log(error.message);
        //connectToDB()
    }
}

module.exports = connectToDB