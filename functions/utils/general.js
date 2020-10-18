const { v4: uuidv4 } = require('uuid');

const generateId = async (value)=>{
    return new Promise((resolve, reject) => {
        const uid = uuidv4(value)
        if (uid) {
          resolve(uid)
        } else {
          reject('could not generate id')
        }
      })
}
module.exports={
  generateId
}