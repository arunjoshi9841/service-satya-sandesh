
const getMinifiedArticle = (article) => {
    let payload = {
      articleId: article.articleId,
      summary: article.summary,
      title: article.title,
      modifiedAt: article.modifiedAt,
      thumbnail: article.thumbnail,
    };
    return payload;
  };

const getMinifiedArticleForUser = (article)=>{
    let payload = {
        articleId: article.articleId,
        summary: article.summary,
        title: article.title,
        modifiedAt: article.modifiedAt,
        isFeatured: article.isFeatured,
        status: article.status,
        viewCount: article.viewCount,
        badge: article.badge
    };
    return payload;
  }
const getMinifiedHeadlines = (article)=>{
    let payload={
        articleId: article.articleId,
        title: article.title,
        modifiedAt: article.modifiedAt,
        viewCount: article.viewCount,
        isFeatured: article.isFeatured,
        badge: article.badge
    };
    return payload;
}
const init = (data) => {
    return new Promise((resolve, reject) => {
      if (
        data.title &&
        data.title
      ) {
        resolve();
      } else if (!data.title) {
        reject('article title is missing');
      } else if (!data.title) {
        reject('Article summary is missing');
      } else if (!data.thumbnail) {
        reject('Article thumbnail is missing');
      }      
    });
  };
const validity = (data) => {
    return new Promise((resolve, reject) => {
      if (
        data.title.length>0 &&
        data.summary.length>50 &&
        data.summary.length<300
      ) {
        resolve();
      } else if (!data.title.length) {
        reject('article title is not valid');
      } else if (!data.summary.length>50 &&
        data.summary.length<300) {
        reject('Article summary is not valid');
        }          
    });
  };
const setNewArticle = (article)=>{
    return {
      articleId: article.articleId, 
      authorId: article.authorId,
      thumbnail: article.thumbnail,           
      title: article.title,
      summary: article.summary,
      createdAt: new Date(),
      modifiedAt: new Date(),
      viewCount: 0,
      isDeleted: false,
      labels: article.labels,
      isFeatured: false,
      status: 'draft',
      bodyText: "",
      badge: "",
    }
}
module.exports={
  setNewArticle,
  validity,
  getMinifiedArticleForUser,
  init,
  getMinifiedArticle,
  getMinifiedHeadlines
}