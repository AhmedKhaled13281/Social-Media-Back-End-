const UserModel = require("../Models/user.model");
const jwt = require("jsonwebtoken");
const AppErrorHandler = require("../Utilities/appErrorHandler");
const catchAsync = require("../Utilities/catchAsync");
const transporter = require("../Utilities/emailHandler");
const filterReqBody = require("../Utilities/filterReqBody");
const uploadToFirebase = require("../Utilities/uploadImgToFireBase")

exports.createToken = (data, res) => {
  const token = jwt.sign({ data }, process.env.JWT_SECERT, { expiresIn: "3d" });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    exp: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)),
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
      throw new Error("This token is Expired!, Please try to login again");
    }

    const user = await UserModel.findOne({ _id: data });

    if (!user) {
      throw new Error("User not found!");
    }

    return user;
  } catch (error) {
    return next(new AppErrorHandler(error.message, 404));
  }
};

exports.forgetPassword = async (email) => {
  const userEmail = await UserModel.findOne({ email });

  if (!userEmail) {
    throw new AppErrorHandler("This email does not existed!", 404);
  }

  const resetToken = await userEmail.createResetToken();

  // First : Change the localhost port with your front-end port (4200 angular port)
  // Second : take the token from the url (in Frontend) and then send it the api below
  // Third : Make the Reset Password page and make two input fields, and send the reset token
  //  and the passwords to the below api
  const resetUrl = `https://localhost:3000/user/forgetPassword?token=${resetToken}`;

  // Zoho
  // const sending = await transporter.sendMail({
  //   from: '"Hello Friends" <ahmedrashad13281@zohomail.com>', // sender address
  //   to: "ahmedrashad174@yahoo.com", // list of receivers
  //   subject: "Reset Your Password", // Subject line
  //   text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`, // plain text body
  //   html: ` <p>You requested a password reset. Click the link below to reset your password:</p>
  //     <a href="${resetUrl}" target="_blank">${resetUrl}</a>
  //     <p>If you did not request this, please ignore this email.</p>`, // html body
  // });

  const sending = await transporter.sendMail({
    from: '"Hello Friends" <ahmedrashad13281@gmail.com>', // sender address
    to: "ahmedrashad174@yahoo.com", // list of receivers
    subject: "Reset Your Password", // Subject line
    text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`, // plain text body
    html: ` <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>`, // html body
  });

  return resetToken;
};

exports.resetPassword = async (body, token) => {
  const { newPassword, newConfirmPassword } = body;

  const userData = await UserModel.findOne({
    passwordResetToken: token,
    passwordResetTokenExpiry: { $gt: Date.now() },
  }).select("+passwordResetToken +passwordResetTokenExpiry");

  if (!userData) {
    return new AppErrorHandler("Token is Expired!", 401);
  }

  userData.password = newPassword;
  userData.confirmPassword = newConfirmPassword;

  userData.passwordResetToken = undefined;
  userData.passwordResetTokenExpiry = undefined;

  await userData.save({ validateBeforeSave: true });

  return userData;
};

exports.updateProfile = async (user, body) => {
  const filteredData = filterReqBody(body, ["bio", "username" , "profilePicture"]);
  const imgUrl = await uploadToFirebase(filteredData.profilePicture)
  const updatedData = {...filteredData , profilePicture : imgUrl}

  const updateUser = await UserModel.findOneAndUpdate(
    user?._id,
    { $set: updatedData },
    { runValidators: true, new: true }
  );

  return updateUser;
};

exports.getUserData = async (userId) => {
  const user = await UserModel.findOne({_id : userId})

  if(!user) {
    return new AppErrorHandler(`No User Found With This ID : ${userId}` , 404)
  }

  return user
}