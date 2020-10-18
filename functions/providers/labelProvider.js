const { db } = require('../infrastructure');
const { generateId } = require('../utils/general');
const labelCollection = db.collection('labels');
const getLabels = async () => {
  return new Promise((resolve, reject) => {
    labelCollection
      .get()
      .then(function (snapshot) {
        let labels = [];
        snapshot.forEach((doc) => {
          labels.push(doc.data());
        });
        resolve(labels);
      })
      .catch((error) => reject(error));
  });
};
const createLabel = async (label) => {
  return new Promise((resolve, reject) => {
    generateId(label.name)
      .then((id) => {
        label.labelId = id;
        labelCollection
          .doc(id)
          .set(label)
          .then(() => {
            resolve(label);
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};
const updateLabel = async (label) => {
  return new Promise((resolve, reject) => {
    labelCollection
      .doc(label.labelId)
      .set(label)
      .then(() => {
        resolve(label);
      })
      .catch((error) => reject(error));
  });
};
const deleteLabel = async (labelId) => {
  return new Promise((resolve, reject) => {
    labelCollection
      .doc(labelId).delete()
      .then(() => {
        resolve();
      })
      .catch((error) => reject(error));
  });
};
module.exports = {
  getLabels,
  createLabel,
  updateLabel,
  deleteLabel,
};
