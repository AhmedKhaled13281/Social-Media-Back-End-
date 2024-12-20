const {Schema , model} = require("mongoose")
const {isEmail , isStrongPassword} = require("validator")
const bcrypt = require('bcrypt')


const UserSchema = new Schema({
    username : {
        type : String,
        required : [true , "Please write an Username"],
    },
    email : {
        type : String,
        required : [true , "Email is Required!"],
        unique : true,
        trim : true,
        lowercase : true,
        validate : [isEmail , `{VALUE} is not a valid Email!`]
    },
    password : {
        type : String,
        required : [true , "Password is Required!"],
        select : false,
        validate : {
            validator : function(val) {
                isStrongPassword(val , {
                    minLength : 6
                })
            },
            message : (props) => `${props.value} is not a valid Password`
        },
    },
    confirmPassword : {
        type : String,
        required : true,
        validate : {
            validator : function(val) {
                return this.password == val
            },
            message : (props) => `${props.value} is not equal the Password`
        }
    },
    isActive : {
        type : Boolean,
        default : false,
    },
    profilePicture : {
        type : String,
    },
    bio : {
        type : String,
        default : "Hi, i'm a new user here !"
    }
} , {timestamps : true})

// Create a Hashing Password
UserSchema.pre('save' , async function(next) {
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password , 12)
    this.confirmPassword = undefined

    next()
})

// Compare Hashing Password
UserSchema.methods.compareHashingPassword = async function(enteredPassword , storedHashPassword) {
    const match = await bcrypt.compare(enteredPassword, storedHashPassword);
    return match
}

const UserModel = model('User' , UserSchema)

module.exports = UserModel