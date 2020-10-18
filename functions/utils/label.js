const validity = (data) => {
  return new Promise((resolve, reject) => {
    if (data.name.length > 0 && data.color.length > 0) {
      resolve();
    } else if (!data.name.length > 0) {
      reject('Label name is not valid');
    } else if (!data.color.length > 0) {
      reject('Label color is not valid');
    }
  });
};
module.exports = {
  validity,
};
