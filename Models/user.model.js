const { Schema, model } = require("mongoose");
const { isEmail, isStrongPassword , isEmpty } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please write an Username"],
      validate : {
        validator : function(val) {
            return !isEmpty(val);
        },
        message : (props) => `${props.value} is an empty field!`
      }
    },
    email: {
      type: String,
      required: [true, "Email is Required!"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [isEmail, `{VALUE} is not a valid Email!`],
    },
    password: {
      type: String,
      required: [true, "Password is Required!"],
      select: false,
      validate: {
        validator: function (val) {
          isStrongPassword(val, {
            minLength: 6,
          });
        },
        message: (props) => `${props.value} is not a valid Password`,
      },
    },
    confirmPassword: {
      type: String,
      required: true,
      validate: {
        validator: function (val) {
          return this.password == val;
        },
        message: (props) => `${props.value} is not equal the Password`,
      },
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    profilePicture: {
      type: String,
    },
    bio: {
      type: String,
      default: "Hi, i'm a new user here !",
      validate : {
        validator : function(val) {
            return !isEmpty(val);
        },
        message : (props) => `${props.value} is an empty field!`
      }
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetTokenExpiry: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// Create a Hashing Password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;

  next();
});

// Compare Hashing Password
UserSchema.methods.compareHashingPassword = async function (
  enteredPassword,
  storedHashPassword
) {
  const match = await bcrypt.compare(enteredPassword, storedHashPassword);
  return match;
};

// Create PasswordResetToken
UserSchema.methods.createResetToken = async function () {
  this.passwordResetToken = await bcrypt.hash("_", 12);
  this.passwordResetTokenExpiry = Date.now() + 60 * 60 * 1000;
  await this.save({ validateBeforeSave: false });
  return this.passwordResetToken
};

const UserModel = model("User", UserSchema);

module.exports = UserModel;
