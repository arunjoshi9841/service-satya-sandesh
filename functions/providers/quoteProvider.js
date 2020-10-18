const { db } = require('../infrastructure');
const quoteCollection = db.collection('quotes');
const getQuote = async () => {
  return new Promise((resolve, reject) => {
    let response = {};
    quoteCollection
      .limit(1)
      .get()
      .then(function (snapshot) {
        snapshot.forEach((quote) => {
          response = quote.data();
        });
        resolve(response);
      })
      .catch((error) => reject(error));
  });
};
const updateQuote = async (quote) => {
  return new Promise((resolve, reject) => {
    quoteCollection
      .doc(quote.id)
      .set(quote)
      .then(() => {
        resolve(quote);
      })
      .catch((error) => reject(error));
  });
};
module.exports = {
  getQuote,
  updateQuote,
};
