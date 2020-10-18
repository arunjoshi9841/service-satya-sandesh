const { auth } = require('../infrastructure');
module.exports.authCheck = (roles=[]) => {
  // authorize based on user role
   return (req, res, next) => {
    try {
      const token = req.headers.authorization.split('Bearer ')[1];
      auth
        .verifyIdToken(token)
        .then((decodedToken) => {  
          let userId = decodedToken.uid;
          let userRole = decodedToken.role;
          if (roles.length > 0) { //if roles defined for route        
            if (roles.includes(userRole)) {
              req.userId = userId;
              req.userRole = userRole;
              next();
            } else {
              res.status(401).send('UnAuthorized');
            }
          } else { //else verify for all roles
            req.userId = userId; 
            req.userRole = userRole;
            next();
          }
        })
        .catch((e) => {
          res.status(401).send('UnAuthorized');
        });
    } catch (e) {
      res.status(401).send('UnAuthorized');
    }
  };
};
