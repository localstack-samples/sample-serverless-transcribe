'use strict';

const awsSdk = require('aws-sdk');

const endpoint = process.env.AWS_ENDPOINT_URL
const s3 = new awsSdk.S3({endpoint: endpoint, s3ForcePathStyle: true});

// This function is triggered by an HTTP request using the GET method.
// The function returns a list of all the transcription jobs stored in the S3 bucket.
exports.list = async (event, context, callback) => {
  var htmlStr = `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Transcripted Jobs</title>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe" crossorigin="anonymous"></script>
  </head>
  <body class="p-3">
    <div>
        <a class="btn btn-md btn-primary" href="/local/upload">Start a new job</a>
    </div>
    <br>
    <br>
    </ul>
`

  const bucketName = "aws-node-sample-transcribe-s3-local-transcriptions";
  const params = {
    Bucket: bucketName,
  };

  try {
    const { Contents } = await s3.listObjects(params).promise();
    const keys = Contents.map(({ Key }) => Key);
    keys.forEach(object => {
      htmlStr += `<li><a href="https://s3.localhost.localstack.cloud:4566/${bucketName}/${object}">${object}</a></li>`
    });
    htmlStr += "</ul></body></html>"
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: htmlStr
    }
  } catch (error) {
    console.log("An error occurred listing objects from S3", error)
    return {
      statusCode: 400,
      body: 'Error listing objects'
    }
  }
};
