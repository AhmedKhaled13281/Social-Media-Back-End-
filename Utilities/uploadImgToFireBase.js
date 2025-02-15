const {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} = require("firebase/storage");
const AppErrorHandler = require("../Utilities/appErrorHandler");

const storage = require("../Config/firebase.config");

const uploadToFirebase = async (image) => {
  try {
    //const image = req.file;
    //   if (!image) {
    //     return res
    //       .status(404)
    //       .json({ success: false, error: "No image file provided" });
    //   }

    const dateTime = new Date();

    if (Array.isArray(image)) {
      let imgUrls = [];
      for (let img of image) {
        const storageRef = ref(storage, `photos/${img.originalname}`);

        const snapshot = await uploadBytesResumable(storageRef, img.buffer);

        const URL = await getDownloadURL(snapshot.ref);
        imgUrls.push(URL);
      }

      return imgUrls;
    } else {
      const storageRef = ref(storage, `photos/${image.originalname}`);

      const snapshot = await uploadBytesResumable(storageRef, image.buffer);

      const URL = await getDownloadURL(snapshot.ref);

      return URL;
    }
  } catch (err) {
    console.log(err);
    return new AppErrorHandler(err.message, 404);
  }
};

module.exports = uploadToFirebase;
