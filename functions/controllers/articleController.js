const functions = require('firebase-functions');
const articleProvider = require('../providers/articleProvider');
const { validity, init } = require('../utils/article');
const getArticles = async (req, res) => {
  const userId = req.userId;
  const articleId = req.query.articleId;
  //single article
  if (articleId) {
    try {
      const article = await articleProvider.getPost(articleId);
      if (article) {
        functions.logger.log(`Successfully requested post of id ${articleId}`);
        return res.status(200).json(article);
      } else {
        functions.logger.log(
          `Could not find requested post of id ${articleId}`
        );
        return res.status(204).send('Could not find requested post');
      }
    } catch (e) {
      functions.logger.log(
        `Internal server error when requesting post of id ${articleId}`,
        e
      );
      return res.status(500).json(e);
    }
  } else {
    //multiple article
    try {
      const articles = await articleProvider.getArticlesForUser(userId);
      if (articles) {
        functions.logger.log(`Successfully requested multiple posts`);
        return res.status(200).json(articles);
      } else {
        functions.logger.log(`No posts found when requesting multiple posts`);
        return res.status(204).send('No articles found');
      }
    } catch (e) {
      functions.logger.log(
        `Internal server error when requesting multiple posts ${articleId}`,
        e
      );
      return res.status(500).json(e);
    }
  }
};
const getReviewArticles = async (req, res) => {
  try {
    let response = await articleProvider.getReviewArticles();
    functions.logger.log(`Successfully requested review article`);
    return res.status(200).json(response);
  } catch (e) {
    functions.logger.log(`review article request failed`, e);
    return res.status(500).json(e);
  }
};
const createArticle = async (req, res) => {
  const userId = req.userId;
  const article = req.body;
  try {
    await init(article);
    await validity(article);
    const response = await articleProvider.createArticle(article, userId);
    functions.logger.log(`New post of title ${response.articleId} created`);
    return res.status(200).json(response);
  } catch (e) {
    functions.logger.log(`Post creation failed`, e);
    return res.status(500).json(e);
  }
};
const updateThumbnail = async (req, res) => {
  const thumbnail = req.body.image;
  const articleId = req.query.articleId;
  const userId = req.userId;
  try {
    const url = await articleProvider.updateThumbnail(
      userId,
      thumbnail,
      articleId
    );
    functions.logger.log(`Updated thumbnail for ${articleId}.`);
    return res.status(200).json(url);
  } catch (e) {
    functions.logger.log(`Thumbnail update failed for ${articleId}`, e);
    return res.status(500).json(e);
  }
};
const updateArticle = async (req, res) => {
  const article = req.body;
  const userId = req.userId;
  try {
    await init(article);
    await validity(article);
    const response = await articleProvider.updateArticle(article, userId);
    functions.logger.log(`Updated article for ${article.articleId}`);
    return res.status(200).json(response);
  } catch (e) {
    functions.logger.log(`Article update failed for ${article.articleId}`, e);
    return res.status(500).json(e);
  }
};
const uploadPicture = async (req, res) => {
  const userId = req.userId;
  const articleId = req.query.articleId;
  const pic = req.body.image;
  try {
    const url = await articleProvider.uploadPicture(userId, pic, articleId);
    functions.logger.log(`Added image for ${articleId}.`);
    return res.status(200).json(url);
  } catch (e) {
    functions.logger.log(`Image add failed for ${articleId}`, e);
    return res.status(500).json(e);
  }
};
const deleteArticle = async (req, res) => {
  const userId = req.userId;
  let articleId = req.query.articleId;
  try {
    await articleProvider.deleteArticle(articleId);
    functions.logger.log(`Successfully deleted article of id ${articleId}`);
    return res.status(200).send('Successfully deleted article');
  } catch (e) {
    functions.logger.log(`Internal server error when deleting article`, e);
    return res.status(500).json(e);
  }
};
const reviewArticle = async (req, res) => {
  const userId = req.userId;
  let articleId = req.query.articleId;
  try {
    await articleProvider.reviewArticle(articleId);
    functions.logger.log(
      `Successfully sent article of id ${articleId} for review`
    );
    return res.status(200).send('Successfully sent article for review');
  } catch (e) {
    functions.logger.log(
      `Internal server error when changing artilcle status`,
      e
    );
    return res.status(500).json(e);
  }
};
const publishArticle = async (req, res) => {
  const userId = req.userId;
  let articleId = req.query.articleId;
  try {
    await articleProvider.publishArticle(articleId);
    functions.logger.log(`Successfully published article of id ${articleId}`);
    return res.status(200).send('Successfully published article');
  } catch (e) {
    functions.logger.log(
      `Internal server error when changing artilcle status`,
      e
    );
    return res.status(500).json(e);
  }
};
const draftArticle = async (req, res) => {
  const userId = req.userId;
  let articleId = req.query.articleId;
  try {
    await articleProvider.draftArticle(articleId);
    functions.logger.log(
      `Successfully changed article status to draft of id ${articleId}`
    );
    return res.status(200).send('Successfully changed article status');
  } catch (e) {
    functions.logger.log(
      `Internal server error when changing artilcle status`,
      e
    );
    return res.status(500).json(e);
  }
};
const getHeadlineArticles = async (req, res) => {
  try {
    let response = await articleProvider.getHeadlinesForEdit(); 
    functions.logger.log(`successfully requested headlines`);
      return res.status(200).json(response);    
  } catch (e) {
    functions.logger.log(`Internal server error when requesting headlines`, e);
    return res.status(500).json(e);
  }
};
const getPublishedArticles = async (req, res) => {
  try {
    let response = await articleProvider.getPublishedArticles();
    functions.logger.log(`successfully requested published articles`);
    return res.status(200).json(response);
  } catch (e) {
    functions.logger.log(`Internal server error when requesting published articles`, e);
    return res.status(500).json(e);
  }
};
const setHeadlines = async (req, res) => {
  let headlines = req.body;
  try {
    await articleProvider.setHeadlines(headlines);
    functions.logger.log(`successfully changed headlines`);
    return res.status(200).send("successfully changed headlines");
  } catch (e) {
    functions.logger.log(`Internal server error when changing headlines`, e);
    return res.status(500).json(e);
  }
};
const setFeatured = async (req, res) => {
  let articleId = req.query.articleId;
  try {
    await articleProvider.setFeatured(articleId);
    functions.logger.log(`successfully changed feature status of ${articleId}`);
    return res.status(200).send("successfully changed feature status");
  } catch (e) {
    functions.logger.log(`Internal server error when changing feature status`, e);
    return res.status(500).json(e);
  }
};
module.exports = {
  getArticles,
  createArticle,
  updateThumbnail,
  updateArticle,
  uploadPicture,
  reviewArticle,
  publishArticle,
  deleteArticle,
  draftArticle,
  getReviewArticles,
  getHeadlineArticles,
  getPublishedArticles,
  setHeadlines,
  setFeatured,
};
