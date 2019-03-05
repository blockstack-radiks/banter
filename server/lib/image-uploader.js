const request = require('request-promise');
const AWS = require('aws-sdk');

const uploadImage = async (uri, pathname) => new Promise(async (resolve) => {
  try {
    if (!process.env.AWS_SECRET_KEY) {
      console.log('Skipping image upload because s3 not configured.');
      return resolve(null);
    }
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });

    const response = await request({
      uri,
      encoding: null,
      transform: (body, _response) => ({
        body,
        headers: _response.headers,
      }),
    });  

    s3.putObject({
      Bucket: process.env.AWS_BUCKET,
      Key: pathname,
      Body: response.body,
      ContentType: response.headers['content-type'],
      ContentLength: response.headers['content-length'],
    }, () => resolve(pathname));
    return true;
  } catch (error) {
    console.error('Error when uploading image to AWS');
    console.error(error);
    return resolve(null);
  }
});

const handleUserSave = async (radiksCollection, user) => {
  let image;
  if (user.profile.image) {
    [image] = user.profile.image;
  }
  if (image) {
    console.log('uploading image');
    await uploadImage(image.contentUrl, `users/${user._id}`);
    console.log('image uploaded');
  }
};

module.exports = {
  uploadImage,
  handleUserSave,
};
