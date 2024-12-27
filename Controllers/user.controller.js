const userService = require("../Services/user.service");
const AppErrorHandler = require("../Utilities/appErrorHandler");

exports.userSignUp = async (req, res, next) => {
  const user = await userService.userSignUp(req, res);
  res
    .status(200)
    .json({ token: user, message: "User Has Created Successfully!" });
};

exports.userSignIn = async (req, res, next) => {
  const { user, passwordMatch } = await userService.userSignIn(req);

  if (!user || !passwordMatch) {
    return next(
      new AppErrorHandler(
        `There is something wrong with Email Or Password`,
        404
      )
    );
  }

  const token = userService.createToken(user._id, res);
  res.status(200).json({ token ,  message: "User Has Signed In Successfully!" });
};

exports.isAuthorized = async (req , res , next) => {
    const token = req.headers.authorization.split(" ")[1]
    if(!token) {
      return next(new AppErrorHandler(`Please Login to access this route ${req.url}`))
    }

    const user = await userService.isAuthorized(token , next)

    req.user = user
    next()
}

// TODO
exports.forgetPassword = async (req , res , next) => {
  // First : Take the email and Check if it existed already or NOT
  const {email} = req.body
  const user = await userService.forgetPassword(email)

  // Second : If Existed, Then send an email to this user

  // Third : Redirect the user to Reset Password
    res.status(200).json({ user , message : "Hello"})
}