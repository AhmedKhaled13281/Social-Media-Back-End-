const UserModel = require("../Models/user.model");
const jwt = require("jsonwebtoken");
const AppErrorHandler = require("../Utilities/appErrorHandler");
const catchAsync = require("../Utilities/catchAsync");

exports.createToken = (data, res) => {
  const token = jwt.sign({ data }, process.env.JWT_SECERT, { expiresIn: "1h" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    exp: new Date(Date.now() + 3600000),
  });

  return token;
};

exports.userSignUp = async (req, res) => {
  const userData = req.body;
  const user = await UserModel.create(userData);
  const token = createToken(user._id, res);
  return token;
};

exports.userSignIn = async (req) => {
  const userData = req.body;

  const user = await UserModel.findOne({ email: userData?.email }).select(
    "+password"
  );

  const passwordMatch = await user?.compareHashingPassword(
    userData.password,
    user.password
  );

  return { user, passwordMatch };
};

exports.isAuthorized = async (token, next) => {
  try {
    const verify = jwt.verify(token, process.env.JWT_SECERT, {
      complete: true,
    });

    const { data, exp } = jwt.decode(token);

    let isExpired = Date.now() > exp * 1000;

    if (isExpired) {
      throw new Error("This token is Expired!, Please try to login again")
    }

    const user = await UserModel.findOne({ _id: data });

    if (!user) {
      throw new Error("User not found!")
    }

    return user;
  } catch (error) {
    return next(new AppErrorHandler(error.message, 404));
  }
};


exports.updateUserProfile = async (req) => {};
