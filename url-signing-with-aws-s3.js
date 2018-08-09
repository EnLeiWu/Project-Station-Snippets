const aws = require('aws-sdk');
//aws access information removed for security reasons

module.exports = {
  getUrl: getUrl
}

//uploading file to AWS S3 and returning a signed url to view files without access to originals

function getUrl(req, res) {
  const s3 = new aws.S3();
  const fileName = 'C55/' + req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: 'sabio-training',
    Key: fileName,
    Expires: 3000,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://sabio-training.s3.amazonaws.com/${fileName}` //unsigned URL
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
}
