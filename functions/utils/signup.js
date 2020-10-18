const { auth } = require('../infrastructure');
const init = (data) => {
  return new Promise((resolve, reject) => {
    if (
      data.email &&
      data.password &&
      data.displayName &&
      data.dob &&
      data.photoURL
    ) {
      resolve();
    } else if (!data.email) {
      reject('Email address is missing');
    } else if (!data.displayName) {
      reject('Name is missing');
    } else if (!data.dob) {
      reject('Date of birth is missing');
    } else if (!data.photoURL) {
      reject('Profile picture is required');
    }
  });
};
const validation = (data) => {
  return new Promise((resolve, reject) => {
    if (!isEmailValid(data.email)) {
      reject('Email address is not valid');
    } else if (!isPasswordValid(data.password)) {
      reject('password is not valid');
    }
     else {
      resolve();
    }
  });
};
const EmailNew = (email) => {
  return new Promise((resolve, reject) => {
    auth
      .getUserByEmail(email)
      .then(function () {
        reject();
      })
      .catch(function (error) {
        resolve();
      });
  });
};
const isEmailValid = (email) => {
  const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email_regex.test(String(email).toLowerCase());
};
const isPasswordValid = (password) => {
  return password.length >= 7;
};
module.exports={
  validation,
  EmailNew,
  init,

}