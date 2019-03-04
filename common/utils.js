export const appUrl = () => {
  let radiksServer = process.env.RADIKS_API_SERVER || 'http://localhost:5000';
  if (process.env.HEROKU_APP_NAME) {
    radiksServer = `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`;
  }
  return radiksServer;
};

export const generateImageUrl = (username, size) => `https://banter-pub.imgix.net/users/${username}?w=${size}&h=${size}&fit=crop&crop=faces,top,left&auto=format`;

