const { db, auth, storage } = require('../infrastructure');
const { uploadUtil } = require('../utils/upload');
const userCollection = db.collection('users');
const { generateId } = require('../utils/general');

const createUser = async (user) => {
    //create new user  
  return new Promise((resolve, reject) => {
  generateId(user.email)
    .then((id) => {
      uploadProfilePicture(id, user.photoURL)
        .then((url) => {
          user.photoURL = url;
          user.uid = id;
          const authUser = setAuthUser(user);
          auth
            .createUser(authUser) //setting up authenticated firebase user
            .then((userRecord) => {
              //setting up user roles
              auth.setCustomUserClaims(userRecord.uid, { role: 'user' }).then(()=>{
                const newUser = setNewUser(user);
                userCollection
                  .doc(userRecord.uid)
                  .set(newUser)
                  .then(() => {                  
                    resolve(newUser);
                  })
                  .catch((error) => reject(error));
              }).catch((error)=>reject(error));              
            })
            .catch((error) => reject(error));
        })
        .catch((error) => reject(error));
    })
    .catch((error) => reject(error));
  });
};
const getUser = async (userId) => {
  return new Promise((resolve, reject) => {
    auth
      .getUser(userId)
      .then((userRecord) => resolve(userRecord))
      .catch((error) => reject(error));
  });
};
const uploadProfilePicture = async (userId, base64String) => {
  return new Promise((resolve, reject) => {
    let fileLocation = `images/${userId}/profile/_dp_${userId}`;
    let picture = uploadUtil(base64String);
    let memoryRefrence = storage
      .bucket()
      .file(`${fileLocation}.${picture.extension}`);
    memoryRefrence
      .save(picture.img, {
        metadata: {
          contentType: picture.mimeType,
          firebaseStorageDownloadTokens: userId,
        },
      })
      .then(() => {
        let urlresp = `https://firebasestorage.googleapis.com/v0/b/satya-sandesh-e89d2.appspot.com/o/${encodeURIComponent(
          `${fileLocation}.${picture.extension}`
        )}?alt=media&token=${userId}`;
        resolve(urlresp);
      })
      .catch((error) => reject(error));
  });
};
const setAuthUser = (user) => {
  return {
    uid: user.uid,
    email: user.email,
    emailVerified: true,
    password: user.password,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
};
const setNewUser = (user) => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    dob: user.dob,
    bio: user.bio,
    occupation: user.occupation,
    photoURL: user.photoURL,
    isDisabled: false,
    isDeleted: false,
    createdAt: new Date(),
    modifiedAt: new Date(),
    role: 'user',
  };
};
module.exports = {
  createUser,
  getUser,
};
