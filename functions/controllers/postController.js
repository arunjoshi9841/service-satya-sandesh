const functions = require("firebase-functions");
const articleProvider = require('../providers/articleProvider');

const getPosts = async (req, res) => {
  const articleId = req.query.id;
  if (articleId) {
    //single article
    try {
      const article = await articleProvider.getPost(articleId);
      if (article) {
        functions.logger.log(`Successfully requested post of id ${articleId}`);
        return res.status(200).json(article);
      } else {
          functions.logger.log(`Could not find requested post of id ${articleId}`);
          return res.status(204).send('Could not find requested post');
      }
    } catch (e) {      
        functions.logger.log(`Internal server error when requesting post of id ${articleId}`, e);
        return res.status(500).json(e);
    }
  } else {
    //multiple article
    try {
      const articles = await articleProvider.getPosts();
      if (articles) {
        functions.logger.log(`Successfully requested multiple posts`);        
        return res.status(200).json(articles);
      } else {
          functions.logger.log(`No posts found when requesting multiple posts`);
          return res.status(204).send('No articles found');
      }
    } catch (e) {
        functions.logger.log(`Internal server error when requesting multiple posts ${articleId}`, e);
        return res.status(500).json(e);
    }
  }
};
const getHeadlines = async (req, res) => {
  try {
    const articles = await articleProvider.getHeadlines();
      functions.logger.log(`Successfully requested headlines`);
      return res.status(200).json(articles);    
  } catch (e) {
      functions.logger.log(`Headlines request failed with error`, e);
      return res.status(500).json(e);
  }
};
const getFeatured = async (req, res) => {
	try {
	  const articles = await articleProvider.getFeatured();
	  if (articles) {
      functions.logger.log(`Successfully requested featured posts`);
		return res.status(200).json(articles);
	  } else {        
        functions.logger.log(`No featured posts found`);
        return res.status(204).send('No featured articles found');
	  }
	} catch (e) {
      functions.logger.log(`Geatured request failed with error`, e);
      return res.status(500).json(e);
	}
  };
module.exports={
  getFeatured,
  getHeadlines,
  getPosts
}