const uploadUtil = (base64String) => {
  let strings = base64String.split(',');
  let extension = '';
  let mimeType = '';
  if (strings[1]) {
    switch (
      strings[0] //check image's extension
    ) {
      case 'data:image/jpeg;base64':
        extension = 'jpeg';
        mimeType = 'image/jpeg';
        break;
      case 'data:image/png;base64':
        extension = 'png';
        mimeType = 'image/png';
        break;
      default:
        //should write cases for more images types
        extension = 'jpg';
        mimeType = 'image/jpg';
        break;
    }
    base64EncodedImageString = strings[1];
  } else {
    extension = 'png';
    mimeType = 'image/png';
    base64EncodedImageString = base64String;
  }
  imageBuffer = Buffer.from(base64EncodedImageString, 'base64');
  let response = {
    img: imageBuffer,
    mimeType: mimeType,
    extension: extension,
  };
  return response;
};
module.exports = {
  uploadUtil,
};
