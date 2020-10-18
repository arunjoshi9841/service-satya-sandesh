const functions = require("firebase-functions");
const userProvider = require("../providers/userProvider");
const signupUtils = require("../utils/signup");

const signup = async (req, res) => {
    var user = req.body;
    try{
        await signupUtils.init(user); //check if required fields are filled
        await signupUtils.validation(user); //checik if values are valid
        await signupUtils.EmailNew(user.email); //check if user with email exists
        let response = await userProvider.createUser(user);
        functions.logger.log(`User registration succeeful for email address ${user.email}`);
        return res.status(200).json(response);
    }
    catch(e){
        functions.logger.log(`User registration failed`, e);
        return res.status(500).json(e);
    }
}
const getUser = async (req, res) => {
    var userId = req.userId;
    try{        
        let response = await userProvider.getUser(userId);
        functions.logger.log(`user data requested by ${userId}`);       
        return res.status(200).json(response);
    }
    catch(e){
        functions.logger.log(`User data request failed`, e);
        return res.status(500).json(e);
    }
}
module.exports ={
    signup,
    getUser,
}