const { db, auth, storage } = require('../infrastructure');
const {
  getMinifiedArticle,
  getMinifiedArticleForUser,
  getMinifiedHeadlines,
} = require('../utils/article');
const { uploadUtil } = require('../utils/upload');
const { generateId } = require('../utils/general');
const { setNewArticle } = require('../utils/article');
const articleCollection = db.collection('articles');
const getPost = async (articleId) => {
  return new Promise((resolve, reject) => {
    articleCollection
      .doc(articleId)
      .get()
      .then((article) => {
        if (article.exists) {
          let _article = article.data();
          if (_article.status === 'published') {
            _article.viewCount = _article.viewCount + 1;
            updateArticleViews(_article.articleId, _article.viewCount);
          }
          getAuthorInfo(_article.authorId)
            .then((authorInfo) => {
              resolve({ ..._article, ...authorInfo });
            })
            .catch((error) => reject(error));
        } else {
          resolve();
        }
      })
      .catch((error) => reject(error));
  });
};
const getPosts = async () => {
  return new Promise((resolve, reject) => {
    articleCollection
      .where('status', '==', 'published')
      .orderBy('modifiedAt')
      .get()
      .then((query) => {
        let miniArticles = [];
        if (!query.empty) {
          query.forEach((doc) => {
            let article = doc.data();
            if(article.badge==="" && !article.isFeatured){
              article = getMinifiedArticle(article);
              miniArticles.push(article);
            }            
          });
          resolve(miniArticles);
        } else {
          resolve();
        }
      })
      .catch((error) => reject(error));
  });
};
const getFeatured = async () => {
  return new Promise((resolve, reject) => {
    articleCollection
      .where('isFeatured', '==', true)
      .orderBy('modifiedAt')
      .get()
      .then((query) => {
        let miniArticles = [];
        if (!query.empty) {
          query.forEach((doc) => {
            let article = doc.data();
            article = getMinifiedArticle(article);
            miniArticles.push(article);
          });
          resolve(miniArticles);
        } else {
          resolve();
        }
      })
      .catch((error) => reject(error));
  });
};
const updateArticleViews = async (articleId, viewCount) => {
  return new Promise((resolve, reject) => {
    articleCollection
      .doc(articleId)
      .update({ viewCount: viewCount })
      .then(() => {
        resolve();
      })
      .catch((error) => reject(error));
  });
};
const getHeadlines = async () => {
  return new Promise((resolve, reject) => {
    const headlines = ['H1', 'H2', 'H3', 'H4'];
    articleCollection
      .where('badge', 'in', headlines)
      .get()
      .then((query) => {
        if (!query.empty) {
          let miniArticles = [];
          query.forEach((doc) => {
            let article = doc.data();
            article = getMinifiedArticle(article);
            miniArticles.push(article);
          });
          resolve(miniArticles);
        }
      })
      .catch((error) => reject(error));
  });
};
const getAuthorInfo = async (authorId) => {
  return new Promise((resolve, reject) => {
    auth
      .getUser(authorId)
      .then((user) => {
        let response = {
          authorName: user.displayName,
          authorImage: user.photoURL,
        };
        resolve(response);
      })
      .catch((error) => reject(error));
  });
};

const getArticlesForUser = async (userId) => {
  return new Promise((resolve, reject) => {
    articleCollection
      .where('authorId', '==', userId)
      .orderBy('modifiedAt')
      .get()
      .then((query) => {
        let miniArticles = [];
        if (!query.empty) {
          query.forEach((doc) => {
            let article = doc.data();
            article = getMinifiedArticleForUser(article);
            miniArticles.push(article);
          });
          resolve(miniArticles);
        } else {
          resolve();
        }
      })
      .catch((error) => reject(error));
  });
};

const createArticle = async (article, userId) => {
  return new Promise((resolve, reject) => {
    generateId(article.title)
      .then((id) => {
        uploadThumbnail(userId, article.thumbnail, id)
          .then((url) => {
            article.thumbnail = url;
            article.articleId = id;
            article.authorId = userId;
            const newArticle = setNewArticle(article);
            articleCollection
              .doc(id)
              .set(newArticle)
              .then(() => {
                resolve(newArticle);
              })
              .catch((error) => reject(error));
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};
const uploadThumbnail = async (userId, base64String, articleId) => {
  return new Promise((resolve, reject) => {
    let fileLocation = `images/${userId}/articles/_header_${articleId}`;
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
const uploadBodyImage = async (userId, base64String, articleId) => {
  return new Promise((resolve, reject) => {
    generateId(userId)
      .then((id) => {
        let fileLocation = `images/${userId}/articles/${articleId}/${id}`;
        let picture = uploadUtil(base64String);
        console.log('here at the upload machine');
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
      })
      .catch((error) => reject(error));
  });
};
const updateThumbnail = async (userId, thumbnail, articleId) => {
  return new Promise((resolve, reject) => {
    uploadThumbnail(userId, thumbnail, articleId)
      .then((url) => {
        articleCollection
          .doc(articleId)
          .update({ thumbnail: url })
          .then(() => {
            resolve(url);
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
};
const updateArticle = async (article, userId) => {
  return new Promise((resolve, reject) => {
    if (article.status === 'draft') {
      articleCollection
        .doc(article.articleId)
        .set(article)
        .then(() => {
          resolve(article);
        })
        .catch((error) => reject(error));
    } else {
      reject('cannot edit article in publish/review');
    }
  });
};
const uploadPicture = async (userId, pic, articleId) => {
  return new Promise((resolve, reject) => {
    uploadBodyImage(userId, pic, articleId)
      .then((url) => {
        resolve(url);
      })
      .catch((error) => reject(error));
  });
};
const deleteArticle = async (articleId) => {
  return new Promise((resolve, reject) => {
    articleCollection
      .doc(articleId)
      .delete()
      .then(() => {
        resolve();
      })
      .catch((error) => reject(error));
  });
};
const reviewArticle = async (articleId) => {
  return new Promise((resolve, reject) => {
    articleCollection
      .doc(articleId)
      .update({ status: 'review' })
      .then(() => {
        resolve();
      })
      .catch((error) => reject(error));
  });
};
const publishArticle = async (articleId) => {
  return new Promise((resolve, reject) => {
    articleCollection
      .doc(articleId)
      .update({ status: 'published' })
      .then(() => {
        resolve();
      })
      .catch((error) => reject(error));
  });
};
const draftArticle = async (articleId) => {
  return new Promise((resolve, reject) => {
    articleCollection
      .doc(articleId)
      .update({ status: 'draft' })
      .then(() => {
        resolve();
      })
      .catch((error) => reject(error));
  });
};
const getReviewArticles = async () => {
  return new Promise((resolve, reject) => {
    articleCollection
      .where('status', '==', 'review')
      .orderBy('modifiedAt')
      .get()
      .then((query) => {
        if (!query.empty) {
          let promiseArr = [];
          query.forEach((doc) => {
            let article = doc.data();
            let articlePromise = new Promise((resolve, reject) => {
              getAuthorInfo(article.authorId)
                .then((authorInfo) => {
                  resolve({ ...article, ...authorInfo });
                })
                .catch((error) => reject(error));
            });
            promiseArr.push(articlePromise);
          });
          Promise.all(promiseArr).then((articles) => resolve(articles));
        } else {
          resolve();
        }
      })
      .catch((error) => reject(error));
  });
};
const getHeadlinesForEdit = async () => {
  return new Promise((resolve, reject) => {
    const headlines = ['H1', 'H2', 'H3', 'H4'];
    articleCollection
      .where('badge', 'in', headlines)
      .get()
      .then((query) => {
        if (!query.empty) {
          let promiseArr = [];
          query.forEach((doc) => {
            let article = doc.data();
            let articlePromise = new Promise((resolve, reject) => {
              getAuthorInfo(article.authorId)
                .then((authorInfo) => {
                  article = getMinifiedHeadlines(article);
                  resolve({ ...article, ...authorInfo });
                })
                .catch((error) => reject(error));
            });
            promiseArr.push(articlePromise);
          });
          Promise.all(promiseArr).then((articles) => {
            articles.sort((a, b) => (a.badge > b.badge ? 1 : -1));
            resolve(articles);
          });
        }
      })
      .catch((error) => reject(error));
  });
};
const getPublishedArticles = async () => {
  return new Promise((resolve, reject) => {
    articleCollection
      .where('status', '==', 'published')
      .orderBy('modifiedAt')
      .get()
      .then((query) => {
        if (!query.empty) {
          let promiseArr = [];
          query.forEach((doc) => {
            let article = doc.data();
            let articlePromise = new Promise((resolve, reject) => {
              getAuthorInfo(article.authorId)
                .then((authorInfo) => {
                  article = getMinifiedHeadlines(article);
                  resolve({ ...article, ...authorInfo });
                })
                .catch((error) => reject(error));
            });
            promiseArr.push(articlePromise);
          });
          Promise.all(promiseArr).then((articles) => resolve(articles));
        }
      })
      .catch((error) => reject(error));
  });
};
const setFeatured = async (articleId) => {
  return new Promise((resolve, reject) => {
    articleCollection
      .doc(articleId)
      .get()
      .then((article) => {
        if (article.exists) {
          article = article.data();
          articleCollection
            .doc(articleId)
            .update({ isFeatured: !article.isFeatured })
            .then(() => {
              resolve();
            });
        } else {
          reject('invalid articleId');
        }
      })
      .catch((error) => reject(error));
  });
};
const setHeadlines = async (headlines) => {
  return new Promise((resolve, reject) => {
    let promiseArr = [];
    headlines.forEach((headline, index) => {
      let headlinePromise = new Promise((resolve, reject) => {
        setHeadline(headline, index)
          .then(() => {
            resolve();
          })
          .catch((error) => reject(error));
      });
      promiseArr.push(headlinePromise);
    });
    Promise.all(promiseArr)
      .then(() => {
        resolve();
      })
      .catch((error) => reject(error));
  });
};
const setHeadline = async (headline, index) => {
  return new Promise((resolve, reject) => {
    removePrevious(`H${index + 1}`)
      .then(() => {
        addNew(headline, `H${index + 1}`)
          .then(() => resolve())
          .catch((error) =>
            reject(`could not add new headline of articleId ${headline}`, error)
          );
      })
      .catch((error) => reject(error));
  });
};
const addNew = async (id, badge) => {
  return new Promise((resolve, reject) => {
    articleCollection
      .doc(id)
      .update({ badge: badge })
      .then(() => {
        resolve();
      })
      .catch((error) => reject(error));
  });
};
const removePrevious = async (badge) => {
  return new Promise((resolve, reject) => {
    articleCollection
      .where('badge', '==', badge)
      .get()
      .then((query) => {
        if (query.empty) {
          resolve();
        } else {
          let changeData;
          query.forEach((doc) => {
            changeData = doc.data();
          });
          articleCollection
            .doc(changeData.articleId)
            .update({ badge: '' })
            .then(() => {
              resolve();
            })
            .catch((error) => reject(error));
        }
      })
      .catch((error) => reject(error));
  });
};
module.exports = {
  createArticle,
  getArticlesForUser,
  getHeadlines,
  getPosts,
  getPost,
  updateThumbnail,
  updateArticle,
  uploadPicture,
  deleteArticle,
  reviewArticle,
  publishArticle,
  draftArticle,
  getReviewArticles,
  getHeadlinesForEdit,
  getPublishedArticles,
  setHeadlines,
  setFeatured,
  getFeatured,
};
