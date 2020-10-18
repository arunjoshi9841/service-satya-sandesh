const route = require('./constants');
const { authCheck } = require('./authorization');
const { signup, getUser } = require('../controllers/userController');
const {
  getArticles,
  createArticle,
  updateThumbnail,
  updateArticle,
  uploadPicture,
  deleteArticle,
  publishArticle,
  reviewArticle,
  draftArticle,
  getReviewArticles,
  getHeadlineArticles,
  getPublishedArticles,
  setHeadlines,
  setFeatured,
} = require('../controllers/articleController');
const {
  getLabels,
  createLabel,
  updateLabel,
  deleteLabel,
} = require('../controllers/labelController.js');
const {
  getPosts,
  getHeadlines,
  getFeatured,
} = require('../controllers/postController');
const { getQuote, updateQuote } = require('../controllers/quoteController.js');
exports = module.exports = (app) => {
  app.get('/', (req, res) => {
    res.send('Server working !!!');
  });

  app
    .route(route.articles)
    .get(authCheck(), getArticles)
    .post(authCheck(), createArticle)
    .put(authCheck(), updateArticle)
    .delete(authCheck(), deleteArticle);

  app.route(route.thumbnail).put(authCheck(), updateThumbnail);

  app
    .route(route.labels)
    .get(getLabels)
    .post(authCheck(['admin']), createLabel)
    .put(authCheck(['admin']), updateLabel)
    .delete(authCheck(['admin']), deleteLabel);

  app
    .route(route.quotes)
    .get(getQuote)
    .put(authCheck(['admin']), updateQuote);

  app.route(route.users).post(signup).get(authCheck(), getUser);

  app.route(route.uploadImage).post(authCheck(), uploadPicture);

  app.route(route.publish).put(authCheck(['admin', 'editor']), publishArticle).get(authCheck(['admin', 'editor']), getPublishedArticles);

  app.route(route.draft).put(authCheck(['admin', 'editor']), draftArticle);

  app.route(route.review).put(authCheck(), reviewArticle).get(authCheck(['admin', 'editor']), getReviewArticles);

  app.route(route.headlines).get(authCheck(['admin', 'editor']), getHeadlineArticles).post(authCheck(['admin', 'editor']), setHeadlines);

  app.route(route.feature).put(authCheck(['admin', 'editor']), setFeatured);

  app.route(route.posts).get(getPosts);

  app.route(route.featurePosts).get(getFeatured);

  app.route(route.headlinePosts).get(getHeadlines);
};
