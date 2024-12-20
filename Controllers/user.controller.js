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

  userService.createToken(user._id, res);
  res.status(200).json({ message: "User Has Signed In Successfully!" });
};
