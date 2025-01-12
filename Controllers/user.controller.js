const userService = require("../Services/user.service");
const AppErrorHandler = require("../Utilities/appErrorHandler");
const LoggerService = require("../Services/logger.service");
const logger = new LoggerService("user.controller");
const { logAudit } = require("../Services/auditing.service");

const multer = require("multer");

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/usersImgs");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
  },
});

const upload = multer({
  //storage: multerStorage,
  storage : multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are Allowed!"), false);
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 },
});

exports.uploadPhoto = upload.single("profilePicture");

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
  res.status(200).json({ token, message: "User Has Signed In Successfully!" });
};

exports.isAuthorized = async (req, res, next) => {
  const token = req?.headers?.authorization?.split(" ")[1];
  if (!token) {
    return next(
      new AppErrorHandler(`Please Login to access this route ${req.url}`)
    );
  }

  const user = await userService.isAuthorized(token, next);

  req.user = user;
  next();
};

exports.forgetPassword = async (req, res, next) => {
  // First : Take the email and Check if it existed already or NOT
  const { email } = req.body;
  const user = await userService.forgetPassword(email);

  res.status(200).json({ token: user });
};

exports.resetPassword = async (req, res, next) => {
  const { token } = req.query;
  const body = req.body;
  const user = await userService.resetPassword(body, token);

  if (user?.status) {
    return next(user);
  }

  const jwtToken = userService.createToken(user._id, res);
  res.status(200).json({ token: jwtToken });
};

exports.updateProfile = async (req, res, next) => {
  const userData = req.user;
  let body = req.body;
  const fileData = req.file;
  body = { ...body, profilePicture: fileData };

  const user = await userService.updateProfile(userData, body);

  logAudit({
    action: "updateUserProfile",
    data: user,
    status: "SUCCESS",
    error: null,
    by: userData?._id,
    ip: req.ip,
  });
  logger.logger.info(`User has been updated : ${user}`);

  if (user?.status) {
    console.log(user?.status);
    logAudit({
      action: "updateUserProfile",
      data: null,
      status: "FAILED",
      error: user?.message,
      by: userData?._id,
      ip: req.ip,
    })
    logger.logger.error(`failed to update user data : ${user?.message}`);
    return next(user);
  }

  res.status(200).json({ updatedUser: user, message: "Updated Successfully!" });
};
