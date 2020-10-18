const validity = (data) => {
    return new Promise((resolve, reject) => {
      if (data.quote.length > 0 && data.author.length > 0) {
        resolve();
      } else if (!data.quote.length > 0) {
        reject('Quote is not valid');
      } else if (!data.author.length > 0) {
        reject('Quote is not valid');
      }
    });
  };
  module.exports = {
    validity,
  };
  