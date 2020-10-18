const functions = require("firebase-functions");
const { validity } = require('../utils/quote');
const quoteProvider = require('../providers/quoteProvider');
const updateQuote=async(req, res)=>{    
    let quote = req.body;
    try{
        await validity(quote);
        let response = await quoteProvider.updateQuote(quote);
        functions.logger.log(`Successfully updated Quote`);
        return res.status(200).json(response);
    }catch(e){
        functions.logger.log(`Internal server error when updating quote`, e);
        return res.status(500).json(e);
    }
}
const getQuote=async(req, res)=>{
    try{
        let quote = await quoteProvider.getQuote();
        functions.logger.log(`Successfully requested quote`);
        return res.status(200).json(quote);
    }catch(e){
        functions.logger.log(`Internal server error when requesting quote`, e);
        return res.status(500).json(e);
    }
}
module.exports={
    updateQuote,
    getQuote,
}