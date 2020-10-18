const functions = require("firebase-functions");
const { validity } = require('../utils/label');
const labelProvider = require('../providers/labelProvider');
const getLabels=async(req, res)=>{
    try{
        let labels = await labelProvider.getLabels();
        functions.logger.log(`Successfully requested labels`);
        return res.status(200).json(labels);
    }catch(e){
        functions.logger.log(`Internal server error when requesting labels`, e);
        return res.status(500).json(e);
    }
}
const createLabel=async(req, res)=>{
    let label = req.body;
    try{
        await validity(label);
        let response = await labelProvider.createLabel(label);
        functions.logger.log(`Successfully created label of id ${response.labelId}`);
        return res.status(200).json(response);
    }catch(e){
        functions.logger.log(`Internal server error when creating label`, e);
        return res.status(500).json(e);
    }
}
const updateLabel=async(req, res)=>{    
    let label = req.body;
    try{
        await validity(label);
        let response = await labelProvider.updateLabel(label);
        functions.logger.log(`Successfully updated label of id ${response.labelId}`);
        return res.status(200).json(response);
    }catch(e){
        functions.logger.log(`Internal server error when requesting labels`, e);
        return res.status(500).json(e);
    }
}
const deleteLabel=async(req, res)=>{    
    let labelId = req.query.labelId;
    try{
        await labelProvider.deleteLabel(labelId);
        functions.logger.log(`Successfully deleted label of id ${labelId}`);
        return res.status(200).send("Successfully deleted label");
    }catch(e){
        functions.logger.log(`Internal server error when deleting label`, e);
        return res.status(500).json(e);
    }
}
module.exports={
    getLabels,
    createLabel,
    updateLabel,
    deleteLabel
}